import { setLoading } from "@/store/reducers/loadingReducer";

export const createApiLoadingMiddleware = (endpoints = []) => {
  return (store) => (next) => (action) => {
    const isRTKQueryAction =
      action.type?.includes('/executeMutation') ||
      action.type?.includes('/executeQuery');

    if (isRTKQueryAction) {
      const endpoint = action.meta?.arg?.endpointName;

      if (endpoint && endpoints.includes(endpoint)) {
        if (action.type.endsWith('/pending')) {
          store.dispatch(setLoading({ endpoint, isLoading: true }));
        } else if (
          action.type.endsWith('/fulfilled') ||
          action.type.endsWith('/rejected')
        ) {
          store.dispatch(setLoading({ endpoint, isLoading: false }));
        }
      }
    }

    return next(action);
  };
};
