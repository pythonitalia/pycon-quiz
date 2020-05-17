import { getBackendDomain } from "./get-backend-domain";

export const getApiUrl = () => {
  return `http://${getBackendDomain()}/`;
};
