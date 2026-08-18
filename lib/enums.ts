// D1 is SQLite, and Prisma does not support enums on SQLite, so these columns
// are stored as TEXT. The unions below keep the same compile-time safety the
// Prisma enums used to give, so invalid values still fail type-checking.
export const Role = {
  CUSTOMER: "CUSTOMER",
  BUSINESS_OWNER: "BUSINESS_OWNER",
  ADMIN: "ADMIN",
} as const;
export type Role = (typeof Role)[keyof typeof Role];

export const BusinessType = {
  GAS_STATION: "GAS_STATION",
  CAR_WASH: "CAR_WASH",
  SERVICE_CENTER: "SERVICE_CENTER",
} as const;
export type BusinessType = (typeof BusinessType)[keyof typeof BusinessType];

export const ApprovalStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  NEEDS_CHANGES: "NEEDS_CHANGES",
  REJECTED: "REJECTED",
  SUSPENDED: "SUSPENDED",
} as const;
export type ApprovalStatus = (typeof ApprovalStatus)[keyof typeof ApprovalStatus];

export const BookingService = {
  CAR_WASH: "CAR_WASH",
  OIL_CHANGE: "OIL_CHANGE",
} as const;
export type BookingService = (typeof BookingService)[keyof typeof BookingService];

export const BookingStatus = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;
export type BookingStatus = (typeof BookingStatus)[keyof typeof BookingStatus];

export const OrderStatus = {
  PENDING: "PENDING",
  PAID: "PAID",
  PROCESSING: "PROCESSING",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
  REFUNDED: "REFUNDED",
} as const;
export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export const PaymentStatus = {
  UNPAID: "UNPAID",
  PAID: "PAID",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED",
} as const;
export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];

export const NotificationType = {
  BOOKING: "BOOKING",
  BUSINESS: "BUSINESS",
  ORDER: "ORDER",
  SYSTEM: "SYSTEM",
} as const;
export type NotificationType = (typeof NotificationType)[keyof typeof NotificationType];
