import c2s from "../utils/http";

const pocketService = {
  downloadPoster(option: any) {
    return c2s(
      {
        url: "https://photostudio.91pitu.com/api/poster/express",
        ...option
      },
      { autoApplyUrlPrefix: false }
    );
  },
  uploadPoster(option: any) {
    return c2s(
      {
        url: "https://photostudio.91pitu.com/api/express/upload",
        method: "post",
        ...option
      },
      { autoApplyUrlPrefix: false }
    );
  },
  getPoster(option: any) {
    return c2s(
      {
        url: "https://photostudio.91pitu.com/api/poster/web_orders",
        ...option
      },
      { autoApplyUrlPrefix: false }
    );
  },
  getApps(option: any) {
    return c2s(
      {
        url: "https://photostudio.91pitu.com/api/photostudio/register/apps",
        ...option
      },
      { autoApplyUrlPrefix: false }
    );
  },
  getPayApps(option: any) {
    return c2s(
      {
        url: "https://photostudio.91pitu.com/api/photostudio/order/apps",
        ...option
      },
      { autoApplyUrlPrefix: false }
    );
  },
  getShops(option: any) {
    return c2s(
      {
        url: "https://photostudio.91pitu.com/api/photostudio/reg-info",
        ...option
      },
      { autoApplyUrlPrefix: false }
    );
  },
  getOrders(option: any) {
    return c2s(
      {
        url: "https://photostudio.91pitu.com/api/photostudio/orders/detail",
        ...option
      },
      { autoApplyUrlPrefix: false }
    );
  }
};

export default pocketService;
