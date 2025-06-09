import Layout from "@/components/shared/layout";
import TableDataComp from "@/components/tableData/tableData";
import { faMapMarkerAlt, faPenAlt, faStore, faTags, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import styles from "@/styles/home.module.scss";
import { getDashboardData, getStores } from "@/functions/globalFunctions";

const Index = () => {
  const [dashboardData, setDashboardData] = useState({});

  useEffect(() => {
    (async () => {
      const token = sessionStorage.getItem("token");
      const user_id = sessionStorage.getItem("userid");
      var obj = { token: token, userid: user_id };
      let response = await getDashboardData(obj);
      if (response) {
        setDashboardData(response);
      }
    })();
  }, []);

  return (
    <Layout page={"Dashboard"}>
      <div>
        <div className={styles.dashboard_detail}>
          <span>
            <label>
              <FontAwesomeIcon icon={faStore} />
            </label>
            <p>
              <b>{dashboardData?.stores}</b>
              <small>stores</small>
            </p>
          </span>
          <span>
            <label>
              <FontAwesomeIcon icon={faTags} />
            </label>
            <p>
              <b>{dashboardData?.categories}</b>
              <small>Categories</small>
            </p>
          </span>
          <span>
            <label>
              <FontAwesomeIcon icon={faMapMarkerAlt} />
            </label>
            <p>
              <b>{dashboardData?.attributes}</b>
              <small>Attributes</small>
            </p>
          </span>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
