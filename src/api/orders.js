import dayjs from "dayjs";
import axios from "axios";

const username = import.meta.env.VITE_API_USERNAME;
const password = import.meta.env.VITE_API_PASSWORD;
const basicAuth = btoa(`${username}:${password}`);
const baseUrl = import.meta.env.VITE_API_BASE_URL;
const companyCode = import.meta.env.VITE_API_COMPANY_CODE;
const subtractDays = Number(import.meta.env.VITE_SUBTRACT_DAYS) || 0;

const today = dayjs()
  .subtract(subtractDays, "days")
  .utc()
  .tz("Asia/Bangkok")
  .format("YYYY-MM-DD");

const headers = {
  Accept: "application/json;odata.metadata=none",
  Authorization: `Basic ${basicAuth}`,
};

export const fetchOrders = async (billType, locationKeys = null) => {
  let billTypeFilter = "";
  if (billType === "REGULAR") {
    billTypeFilter = "billType eq 'REGULAR'";
  } else if (billType === "SCHEDULE") {
    billTypeFilter = "billType eq 'SCHEDULE'";
  } else {
    billTypeFilter = "billType ne 'REGULAR' and billType ne 'SCHEDULE'";
  }

  const baseFilter = `statusPicking ne ' ' and ${billTypeFilter} and releaseddate ge ${today}T00:00:00.00Z`;
  let expand = "salesordersubs";

  if (locationKeys && locationKeys.length > 0) {
    const filters = locationKeys
      .map((code) => `locationCode eq '${code}'`)
      .join(" or ");
    expand = `salesordersubs($filter=${filters})`;
  }

  const url = `${baseUrl}/orders/dashboard`;

  const res = await axios.get(url, { headers });
  const { data } = res;
  console.log({ data })
  return data;
};
