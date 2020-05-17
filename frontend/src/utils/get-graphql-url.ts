import { getBackendUrl } from "./get-backend-url";

export const getGraphQLUrl = () => `${getBackendUrl()}/graphql`;
