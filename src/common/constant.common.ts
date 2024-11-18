/**
 * This is a copy of the file in the backend
 * Do NOT add anything to this file, only copy and paste the entire file from the backend
 * For any frontend specific constants add it to constat_frontend.common.ts
 */
export const ROLES = {
  ADMIN: "ADMIN",
  SUBADMIN: "SUBADMIN",

  // COMPANY: "COMPANY",
  STORE: "STORE",
  EMPLOYEE: "EMPLOYEE", // can make request for registration.
  USER: "USER", // can make request for registration.
  VENDOR: "VENDOR", // can make request for registration.
} as const;
export type ROLES_TYPE = keyof typeof ROLES;

export const REPORT_STATUS = {
  ENQUEUED: "ENQUEUED",
  PROCESSING: "PROCESSING",
  PROCESSED: "PROCESSED",
} as const;
export type REPORT_STATUS_TYPE = keyof typeof REPORT_STATUS;


// pagination.constants.js
export const defaultPageIndex = 1;
export const defaultPageSize = 10000;
export const pageIndex = "pageIndex";
export const pageSize = "pageSize";












export const APPROVE_STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  DENIED: "DENIED",
} as const;
export type APPROVE_STATUS_TYPE = keyof typeof APPROVE_STATUS;

/** For Primary beat tagging only these roles are allowed */


/*
 *Type of order return or placed
 */
export const ORDER_TYPE = {
  RETURN: "RETURN",
  NORMAL: "NORMAL",
} as const;
export type ORDER_TYPE_TYPE = keyof typeof ORDER_TYPE;

/**
 * order status
 */
export const ORDER_STATUS = {
  INITIATED: "INITIATED",
  ACCEPTED: "ACCEPTED",
  DENIED: "DENIED",
  DISPATCHED: "DISPATCHED", //check stock
  DELIVERED: "DELIVERED",
  CANCELED: "CANCELED",
  RETURNED: "RETURNED",
} as const;
export type ORDER_STATUS_TYPE = keyof typeof ORDER_STATUS;







export const generalModelStatus = {
  APPROVED: "APPROVED",
  DECLINED: "DECLINED",
  PENDING: "PENDING",
} as const

export type GENERAL_MODEL_TYPE = keyof typeof generalModelStatus;

export const STATUSTYPE = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
} as const

export type STATUS_TYPE = keyof typeof STATUSTYPE;

export const CHARGETYPE = {
  PLUS: "PLUS",
  MINUS: "MINUS",
} as const

export type CHARGE_TYPE = keyof typeof CHARGETYPE;

export const GSTTYPE = {
  REGISTERED: "REGISTERED",
  UNREGISTERED: "UNREGISTERED",
} as const

export type GST_TYPE = keyof typeof GSTTYPE;
export const MEMBERSHIP = {
  GOLD: "GOLD",
  SILVER: "SILVER",
  PLATINUM: "PLATINUM",
  DIAMOND: "DIAMOND",
} as const

export type MEMBERSHIP_TYPE = keyof typeof MEMBERSHIP;
export const LEDGER = {
  CUSTOMER: "CUSTOMER",
  SUPPLIER: "SUPPLIER",
  
} as const

export type LEDGER_TYPE = keyof typeof LEDGER;
export const BILLIINTYPE = {
  MRP: "MRP",
  WS: "WS",
  
} as const

export type BILLING_TYPE = keyof typeof BILLIINTYPE;
// export type LEDGER_TYPE = keyof typeof LEDGER;
export const TRANSPORTMODE = {
  ROAD: "ROAD",
  RAIL: "RAIL",
  AIR: "AIR",
  SHIP: "SHIP",
  
} as const

export type TRANSPORTMODE_TYPE = keyof typeof TRANSPORTMODE;
export const MSMESTATUS = {
  UNREGISTERED: "UNREGISTERED",
  TRADING: "TRADING",
  MANUFACTURER: "MANUFACTURER",
  
  
} as const

export type MSMESTATUS_TYPE = keyof typeof MSMESTATUS;





