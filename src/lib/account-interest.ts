import { apiRequest } from "@/lib/queryClient";

export type AccountInterestFields = {
  firstName: string;
  lastName: string;
  email: string;
  companyWebsite: string;
  location: string;
  orgType: string;
  numberOfLawyers: string;
  hearAbout: string;
};

export type AccountInterestPayload = AccountInterestFields & { source: string };

const REQUIRED_FIELDS: (keyof AccountInterestFields)[] = [
  "firstName",
  "lastName",
  "email",
  "companyWebsite",
  "location",
  "orgType",
  "numberOfLawyers",
  "hearAbout",
];

export function emptyAccountInterestFields(): AccountInterestFields {
  return {
    firstName: "",
    lastName: "",
    email: "",
    companyWebsite: "",
    location: "",
    orgType: "",
    numberOfLawyers: "",
    hearAbout: "",
  };
}

export function isAccountInterestComplete(form: AccountInterestFields): boolean {
  return REQUIRED_FIELDS.every((key) => Boolean(form[key]));
}

export async function submitAccountInterest(data: AccountInterestPayload): Promise<unknown> {
  const res = await apiRequest("POST", "/api/quant/account-interest", data);
  return res.json();
}
