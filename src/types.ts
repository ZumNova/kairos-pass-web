/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum PassState {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  INVALID = 'INVALID',
}

export interface PremiumPass {
  id: string; // The Unique Digital Seal/Proof ID (e.g. 0x8fa4...91c2)
  assetName: string; // e.g. "Piscina Las Acacias Doradas"
  assetType: string; // e.g. "VIP Pool", "Private Theater Box", "Hotel Spa"
  venueName: string; // e.g. "Las Acacias Doradas Resort"
  authorizedUser: string; // e.g. "Sofía Martínez"
  contactDetails: string; // Email or Phone number
  startDateTime: string; // ISO or human string of starting time
  durationHours: number; // e.g. 4
  expiresAt: string; // ISO string of expiration time
  status: PassState;
  digitalSeal: string; // Full hex value
  tokenId?: number;
  tokenURI?: string;
  imageUrl?: string;
  contractAddress?: string;
  explorerUrl?: string;
  ownerAddress?: string;
  userAddress?: string;
}
