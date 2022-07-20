export interface CompanyInfo {
  id?: string | number;
  email:  string;
  companyName:  string;
  location: string;
  organizationType: string;
  workingHours: string;
  organizationSize: string;
  about?: string;
}