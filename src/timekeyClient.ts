import { PassState, PremiumPass } from "./types";

const RPC_URL = "https://sepolia-rollup.arbitrum.io/rpc";
const EXPLORER_URL = "https://sepolia.arbiscan.io";
const CONTRACT_ADDRESS = "0x95e1c52ecaa7c453bb659d0dbece51fe8f0efff2";
const PINATA_GATEWAY = "https://lavender-kind-tuna-494.mypinata.cloud/ipfs/";

const SELECTORS = {
  ownerOf: "0x6352211e",
  userOf: "0xc2f1f14a",
  userStarts: "0x9f0dfc97",
  userExpires: "0x8fc88c48",
  isValid: "0x27a956f6",
  tokenURI: "0xc87b56dd",
  passTermsHash: "0xe292221b",
};

const KNOWN_TOKENS = [
  { tokenId: 12, label: "Kairos 1" },
  { tokenId: 13, label: "Kairos 2" },
  { tokenId: 11, label: "Kairos 3" },
];

const IMAGE_FALLBACKS: Record<number, string> = {
  9: `${PINATA_GATEWAY}bafkreifmyhmgwvycl3hcqxgtwt54mc5fartjx3yam6d3a4qw6wjofiovlm`,
  10: `${PINATA_GATEWAY}bafkreiaipqeklbdarw2iq425ei7syoobj3c22uiyt7fy2mylgva3dewvua`,
  11: `${PINATA_GATEWAY}bafybeigev3vyxnx4g234wxkpw4rypipcn2t2gogthggrbsodgxuv75mbyi`,
  12: `${PINATA_GATEWAY}bafybeiekjv2hlqdyhp532i3adap7degcrt4vtpbtnuc2mklt5h3y4gguke`,
  13: `${PINATA_GATEWAY}bafybeibn7wrhm7iifw75wt455rd2ic23dv4p4w6evsqclxlf6di7qq6rom`,
};

const TOKEN_PRESENTATION: Record<number, { assetName: string; assetType: string; venueName: string; issuer: string }> = {
  12: {
    assetName: "Acceso a piscina",
    assetType: "VIP Piscina 10 horas",
    venueName: "Kairos 1 - Club River Plate",
    issuer: "Club River Plate",
  },
  13: {
    assetName: "Viaje espacial premium",
    assetType: "VIP SpaceX 10 horas",
    venueName: "Kairos 2 - SpaceX",
    issuer: "SpaceX",
  },
  11: {
    assetName: "Suite ejecutiva",
    assetType: "VIP Hotel 24 horas",
    venueName: "Kairos 3 - Sheratton Hotel",
    issuer: "Sheratton Hotel",
  },
};

type NftMetadata = {
  name?: string;
  description?: string;
  image?: string;
  attributes?: { trait_type?: string; value?: string }[];
};

export async function loadTimeKeyPasses(): Promise<PremiumPass[]> {
  const passes = await Promise.all(KNOWN_TOKENS.map((token) => loadTimeKeyPass(token.tokenId, token.label)));
  return passes;
}

export async function loadTimeKeyPass(tokenId: number, fallbackLabel = `TimeKey #${tokenId}`): Promise<PremiumPass> {
  const [owner, user, starts, expires, tokenURI, termsHash] = await Promise.all([
    callAddress(SELECTORS.ownerOf, tokenId),
    callAddress(SELECTORS.userOf, tokenId),
    callUint(SELECTORS.userStarts, tokenId),
    callUint(SELECTORS.userExpires, tokenId),
    callString(SELECTORS.tokenURI, tokenId),
    callBytes32(SELECTORS.passTermsHash, tokenId),
  ]);

  const metadata = await loadMetadata(tokenURI);
  const nowSeconds = Math.floor(Date.now() / 1000);
  const status = user !== zeroAddress() && nowSeconds >= starts && nowSeconds <= expires
    ? PassState.ACTIVE
    : PassState.EXPIRED;

  const passType = attribute(metadata, "Pass Type") || "VIP 10 Hours";
  const visual = attribute(metadata, "Visual") || fallbackLabel;
  const presentation = TOKEN_PRESENTATION[tokenId];

  return {
    id: `timekey-${tokenId}`,
    tokenId,
    assetName: presentation?.assetName || metadata.name || fallbackLabel,
    assetType: presentation?.assetType || passType,
    venueName: presentation?.venueName || visual,
    authorizedUser: presentation?.issuer || "Kairos",
    contactDetails: `Usuario autorizado: ${shortAddress(user)}`,
    startDateTime: `${formatTime(starts)} - ${formatTime(expires)}`,
    durationHours: Math.max(1, Math.round((expires - starts) / 3600)),
    expiresAt: new Date(expires * 1000).toISOString(),
    status,
    digitalSeal: termsHash,
    tokenURI,
    imageUrl: normalizeIpfs(metadata.image || "") || IMAGE_FALLBACKS[tokenId],
    contractAddress: CONTRACT_ADDRESS,
    explorerUrl: `${EXPLORER_URL}/token/${CONTRACT_ADDRESS}?a=${tokenId}`,
    ownerAddress: owner,
    userAddress: user,
  };
}

export async function verifyTimeKey(tokenId: number, expectedUser?: string) {
  const pass = await loadTimeKeyPass(tokenId);
  const user = expectedUser || pass.userAddress || zeroAddress();
  const valid = await callBool(SELECTORS.isValid, tokenId, user);
  return {
    pass: { ...pass, status: valid ? pass.status : PassState.INVALID },
    valid,
  };
}

function attribute(metadata: NftMetadata, key: string): string | undefined {
  return metadata.attributes?.find((item) => item.trait_type === key)?.value;
}

async function loadMetadata(tokenURI: string): Promise<NftMetadata> {
  const response = await fetch(normalizeIpfs(tokenURI));
  if (!response.ok) throw new Error(`No se pudo cargar metadata: ${response.status}`);
  return response.json();
}

function normalizeIpfs(uri: string): string {
  if (!uri) return "";
  if (uri.startsWith("ipfs://")) return `${PINATA_GATEWAY}${uri.slice("ipfs://".length)}`;
  return uri;
}

async function callAddress(selector: string, tokenId: number): Promise<string> {
  const result = await ethCall(selector, encodeUint(tokenId));
  return `0x${result.slice(-40)}`.replace(/^0x0x/, "0x");
}

async function callUint(selector: string, tokenId: number): Promise<number> {
  const result = await ethCall(selector, encodeUint(tokenId));
  return Number(BigInt(result));
}

async function callBool(selector: string, tokenId: number, address: string): Promise<boolean> {
  const result = await ethCall(selector, `${encodeUint(tokenId)}${encodeAddress(address)}`);
  return BigInt(result) === 1n;
}

async function callBytes32(selector: string, tokenId: number): Promise<string> {
  return ethCall(selector, encodeUint(tokenId));
}

async function callString(selector: string, tokenId: number): Promise<string> {
  const result = await ethCall(selector, encodeUint(tokenId));
  return decodeString(result);
}

async function ethCall(selector: string, encodedArgs: string): Promise<string> {
  const response = await fetch(RPC_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: Date.now(),
      method: "eth_call",
      params: [{ to: CONTRACT_ADDRESS, data: `${selector}${encodedArgs}` }, "latest"],
    }),
  });
  const payload = await response.json();
  if (payload.error) throw new Error(payload.error.message || "RPC error");
  return payload.result;
}

function encodeUint(value: number): string {
  return BigInt(value).toString(16).padStart(64, "0");
}

function encodeAddress(address: string): string {
  return address.toLowerCase().replace(/^0x/, "").padStart(64, "0");
}

function decodeString(hex: string): string {
  const clean = hex.replace(/^0x/, "");
  const length = Number(BigInt(`0x${clean.slice(64, 128)}`));
  const data = clean.slice(128, 128 + length * 2);
  const bytes = data.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) || [];
  return new TextDecoder().decode(new Uint8Array(bytes));
}

function formatTime(seconds: number): string {
  return new Intl.DateTimeFormat("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
  }).format(new Date(seconds * 1000));
}

function shortAddress(address: string): string {
  if (!address || address === zeroAddress()) return "Sin usuario activo";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function zeroAddress() {
  return "0x0000000000000000000000000000000000000000";
}
