import axios from "axios";
import { useEffect, useState } from "react";
import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import Script from "next/script";

declare global {
  interface Window {
    Obie: any;
  }
}

const property = {
  addressLine1: "1870 Kiralfy Ave",
  city: "Pittsburgh",
  state: "PA",
  postalCode: "15216",
};

function handleObieLoad() {
  window.Obie.init({
    sandbox: true,
    partnerId: process.env.NEXT_PUBLIC_OBIE_PARTNER_ID,
  });

  window.Obie.events.on("quote_created", ({ code }: { code?: string }) => {
    // The user did not want to share their policy data
    if (!code) return;

    axios.post("http://localhost:3333/api/fetchObieUsersAccessToken", {
      code,
    });
  });
}

const Home: NextPage = () => {
  const [policies, setPolicies] = useState([]);

  useEffect(() => {
    const fetchPolicies = () => {
      fetch("http://localhost:3333/api/policies")
        .then((res) => res.json())
        .then((policies) => {
          setPolicies(policies);
        });
    };

    const handler = window.setInterval(fetchPolicies, 1000);

    () => {
      window.clearInterval(handler);
    };
  }, []);

  return (
    <div className={styles.container}>
      <Script
        src="https://static.obierisk.com/sdk/obie.js"
        onLoad={handleObieLoad}
      />

      <div className={styles.header}>
        <div
          className="obie-instant-estimate"
          data-address-line-1={property.addressLine1}
          data-city={property.city}
          data-state={property.state}
          data-postal-code={property.postalCode}
        >
          <h1 className={styles.title}>
            The right <span>insurance</span> for the right property
          </h1>
          <p className={styles.subTitle}>
            Play it safe by getting coverage with [obie_logo] for as low as{" "}
            {"{estimate}"}/year.
          </p>
          <button className={styles.cta}>Get Insured</button>
        </div>
      </div>

      {!!policies.length && (
        <div className={styles.policies}>
          <h2>Your Obie Policies</h2>

          {policies.map((policy: any) => {
            return (
              <div className={styles.policy} key={policy.id}>
                <p>
                  <strong>
                    {policy.property.addressLine1} {policy.property.city},{" "}
                    {policy.property.state}
                  </strong>
                </p>

                <p>Premium: {policy.premiumAmount}</p>
                <p>Policy Number: {policy.policyNumber}</p>
                <p>Effective Date: {policy.effectiveStartDate}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Home;
