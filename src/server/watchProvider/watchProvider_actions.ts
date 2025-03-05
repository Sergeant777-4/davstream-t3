"use server";

import watchProviderService from "./watchProvider_service";

export const getAllWatchProviders = async () => {
  const watchProviders = await watchProviderService.getAll({ take: 10 });
  return watchProviders;
};

export const getWatchProviderDetails = async (id: number) => {
    const watchProvider = await watchProviderService.getDetails(id)
    return watchProvider
}