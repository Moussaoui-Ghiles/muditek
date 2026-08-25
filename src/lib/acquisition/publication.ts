export function isAcquisitionPreviewEnvironment(): boolean {
  return process.env.VERCEL_ENV === "preview" || process.env.NODE_ENV === "development";
}
