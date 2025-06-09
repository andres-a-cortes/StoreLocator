import { globalConfig } from "@/globalConfig";

export const login = (obj) => {
  return fetch(`${globalConfig.baseUrl}/login.php`, {
    method: "POST",
    body: JSON.stringify(obj),
  })
    .then((response) => response.json())
    .then((data) => data)
    .catch((err) => console.log(err));
};

export const getStores = (obj) => {
  return fetch(`${globalConfig.baseUrl}getallstores.php?user=${obj.userid}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${obj.token}`, // Pass the Bearer token from the `obj`
      "Content-Type": "application/json", // Optional but often included for JSON APIs
    },
  })
    .then((response) => response.json())
    .then((data) => data)
    .catch((err) => console.log(err));
};
export const getAttributes = (obj) => {
  return fetch(`${globalConfig.baseUrl}getattributes.php?user=${obj.userid}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${obj.token}`, // Pass the Bearer token from the `obj`
      "Content-Type": "application/json", // Optional but often included for JSON APIs
    },
  })
    .then((response) => response.json())
    .then((data) => data)
    .catch((err) => console.log(err));
};
export const getCategories = (obj) => {
  return fetch(`${globalConfig.baseUrl}getcategories.php?user=${obj.userid}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${obj.token}`, // Pass the Bearer token from the `obj`
      "Content-Type": "application/json", // Optional but often included for JSON APIs
    },
  })
    .then((response) => response.json())
    .then((data) => data)
    .catch((err) => console.log(err));
};
export const addCategory = (obj) => {
  return fetch(`${globalConfig.baseUrl}addcategory.php?user=${obj.userid}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${obj.token}`, // Pass the Bearer token from the `obj`
      "Content-Type": "application/json", // Optional but often included for JSON APIs
    },
    body: JSON.stringify(obj.body),
  })
    .then((response) => response.json())
    .then((data) => data)
    .catch((err) => console.log(err));
};
export const uploadCSV = (obj) => {
  return fetch(`${globalConfig.baseUrl}uploadcsv.php?user=${obj.userid}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${obj.token}`, // Pass the Bearer token from the `obj`
    },
    body: obj.formData,
  })
    .then((response) => response.json())
    .then((data) => data)
    .catch((err) => console.log(err));
};
export const getDashboardData = (obj) => {
  return fetch(`${globalConfig.baseUrl}commonactions.php?action=getDashData&user=${obj.userid}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${obj.token}`, // Pass the Bearer token from the `obj`
      "Content-Type": "application/json", // Optional but often included for JSON APIs
    },
  })
    .then((response) => response.json())
    .then((data) => data)
    .catch((err) => console.log(err));
};
export const getCSVData = (obj) => {
  return fetch(`${globalConfig.baseUrl}commonactions.php?action=getCsvData&user=${obj.userid}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${obj.token}`, // Pass the Bearer token from the `obj`
      "Content-Type": "application/json", // Optional but often included for JSON APIs
    },
  })
    .then((response) => response.json())
    .then((data) => data)
    .catch((err) => console.log(err));
};
export const deleteData = (obj) => {
  return fetch(`${globalConfig.baseUrl}commonactions.php?action=${obj.action}&ids=${obj.ids}&user=${obj.userid}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${obj.token}`, // Pass the Bearer token from the `obj`
      "Content-Type": "application/json", // Optional but often included for JSON APIs
    },
  })
    .then((response) => response.json())
    .then((data) => data)
    .catch((err) => console.log(err));
};
export const addAttribute = (obj) => {
  return fetch(`${globalConfig.baseUrl}addattribute.php?user=${obj.userid}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${obj.token}`, // Pass the Bearer token from the `obj`
      "Content-Type": "application/json", // Optional but often included for JSON APIs
    },
    body: JSON.stringify(obj.body),
  })
    .then((response) => response.json())
    .then((data) => data)
    .catch((err) => console.log(err));
};
export const editAddtribute = (obj) => {
  return fetch(`${globalConfig.baseUrl}editattribute.php?user=${obj.userid}&catid=${obj.id}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${obj.token}`, // Pass the Bearer token from the `obj`
    },
    body: JSON.stringify(obj.body),
  })
    .then((response) => response.json())
    .then((data) => data)
    .catch((err) => console.log(err));
};
export const getLevels = (obj) => {
  return fetch(`${globalConfig.baseUrl}getlevels.php?user=${obj.userid}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${obj.token}`, // Pass the Bearer token from the `obj`
      "Content-Type": "application/json", // Optional but often included for JSON APIs
    },
  })
    .then((response) => response.json())
    .then((data) => data)
    .catch((err) => console.log(err));
};
export const addLevel = (obj) => {
  return fetch(`${globalConfig.baseUrl}addlevel.php?user=${obj.userid}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${obj.token}`, // Pass the Bearer token from the `obj`
      "Content-Type": "application/json", // Optional but often included for JSON APIs
    },
    body: JSON.stringify(obj.body),
  })
    .then((response) => response.json())
    .then((data) => data)
    .catch((err) => console.log(err));
};
export const editLevel = (obj) => {
  return fetch(`${globalConfig.baseUrl}editlevel.php?user=${obj.userid}&levelid=${obj.id}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${obj.token}`, // Pass the Bearer token from the `obj`
    },
    body: JSON.stringify(obj.body),
  })
    .then((response) => response.json())
    .then((data) => data)
    .catch((err) => console.log(err));
};
export const addBrand = (obj) => {
  return fetch(`${globalConfig.baseUrl}addbrand.php?user=${obj.userid}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${obj.token}`, // Pass the Bearer token from the `obj`
      "Content-Type": "application/json", // Optional but often included for JSON APIs
    },
    body: JSON.stringify(obj.body),
  })
    .then((response) => response.json())
    .then((data) => data)
    .catch((err) => console.log(err));
};
export const editBrand = (obj) => {
  return fetch(`${globalConfig.baseUrl}editbrand.php?user=${obj.userid}&brandid=${obj.id}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${obj.token}`, // Pass the Bearer token from the `obj`
    },
    body: JSON.stringify(obj.body),
  })
    .then((response) => response.json())
    .then((data) => data)
    .catch((err) => console.log(err));
};
export const getBrands = (obj) => {
  return fetch(`${globalConfig.baseUrl}getbrands.php?user=${obj.userid}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${obj.token}`, // Pass the Bearer token from the `obj`
      "Content-Type": "application/json", // Optional but often included for JSON APIs
    },
  })
    .then((response) => response.json())
    .then((data) => data)
    .catch((err) => console.log(err));
};
export const editCategory = (obj) => {
  return fetch(`${globalConfig.baseUrl}editcategory.php?user=${obj.userid}&catid=${obj.id}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${obj.token}`, // Pass the Bearer token from the `obj`
    },
    body: JSON.stringify(obj.body),
  })
    .then((response) => response.json())
    .then((data) => data)
    .catch((err) => console.log(err));
};
export const getStoresList = (obj) => {
  return fetch(`${globalConfig.baseUrl}storeslist.php`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => data)
    .catch((err) => console.log(err));
};

export const getStoresListNodeApi = (obj) => {
  //return fetch(`${globalConfig.baseUrl}storeslist.php`, {
  return fetch(`http://localhost:5000/getData`, {
    // http://localhost:5000/getData //https://locator-api.vercel.app/api/getData
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => data)
    .catch((err) => console.log(err));
};

export const getStoreById = (obj) => {
  return fetch(`${globalConfig.baseUrl}getstoresbyid.php?user=${obj.userid}&id=${obj.id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${obj.token}`, // Pass the Bearer token from the `obj`
      "Content-Type": "application/json", // Optional but often included for JSON APIs
    },
  })
    .then((response) => response.json())
    .then((data) => data)
    .catch((err) => console.log(err));
};
export const addStore = (obj) => {
  return fetch(`${globalConfig.baseUrl}addstore.php?user=${obj.userid}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${obj.token}`, // Pass the Bearer token from the `obj`
      "Content-Type": "application/json", // Optional but often included for JSON APIs
    },
    body: JSON.stringify(obj.body),
  })
    .then((response) => response.json())
    .then((data) => data)
    .catch((err) => console.log(err));
};
export const editStore = (obj) => {
  return fetch(`${globalConfig.baseUrl}editstore.php?user=${obj.userid}&id=${obj.id}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${obj.token}`, // Pass the Bearer token from the `obj`
    },
    body: JSON.stringify(obj.body),
  })
    .then((response) => response.json())
    .then((data) => data)
    .catch((err) => console.log(err));
};
export const getFrontendFilters = (action) => {
  return fetch(`${globalConfig.baseUrl}frontactions.php?action=${action}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json", // Optional but often included for JSON APIs
    },
  })
    .then((response) => response.json())
    .then((data) => data)
    .catch((err) => console.log(err));
};
