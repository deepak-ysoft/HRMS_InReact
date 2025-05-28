export interface EmployeeAsset {
  assetId: number;
  assetName: string;
  description: string;
  imagePath?: string;
  image?: File | null;
  empId: number;
}
