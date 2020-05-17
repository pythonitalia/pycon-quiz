import { getBackendDomain } from "./get-backend-domain";

export const getApiUrl = () => {
  let protocol = "http";

  if (process.env.NODE_ENV === "production") {
    protocol = "https";
  }

  return `${protocol}://${getBackendDomain()}/`;
};
