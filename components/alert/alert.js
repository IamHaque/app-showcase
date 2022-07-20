import { useRouter } from "next/router";

import { useState, useEffect } from "react";

import PropTypes from "prop-types";

import { alertService, AlertType } from "services";

import styles from "./alert.module.scss";

Alert.propTypes = {
  id: PropTypes.string,
  fade: PropTypes.bool,
};

Alert.defaultProps = {
  id: "default-alert",
  fade: true,
};

export default function Alert({ id, fade }) {
  const router = useRouter();
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    // subscribe to new alert notifications
    const subscription = alertService.onAlert(id).subscribe((alert) => {
      // clear alerts when an empty alert is received
      if (!alert.message) {
        setAlerts((alerts) => {
          // filter out alerts without 'keepAfterRouteChange' flag
          const filteredAlerts = alerts.filter((x) => x.keepAfterRouteChange);

          // set 'keepAfterRouteChange' flag to false on the rest
          filteredAlerts.forEach((x) => delete x.keepAfterRouteChange);

          return filteredAlerts;
        });
      } else {
        // add alert to array
        setAlerts((alerts) => [...alerts, alert]);

        // auto close alert if required
        if (alert.autoClose) {
          setTimeout(() => removeAlert(alert), 3000);
        }
      }
    });

    // clear alerts on location change
    const clearAlerts = () => {
      setTimeout(() => alertService.clear(id));
    };

    router.events.on("routeChangeStart", clearAlerts);

    // clean up function that runs when the component unmounts
    return () => {
      // unsubscribe to avoid memory leaks
      subscription.unsubscribe();
      router.events.off("routeChangeStart", clearAlerts);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function removeAlert(alert) {
    if (fade) {
      // fade out alert
      const alertWithFade = { ...alert, fade: true };
      setAlerts((alerts) =>
        alerts.map((x) => (x === alert ? alertWithFade : x))
      );

      // remove alert after faded out
      setTimeout(() => {
        setAlerts((alerts) => alerts.filter((x) => x !== alertWithFade));
      }, 300);
    } else {
      // remove alert
      setAlerts((alerts) => alerts.filter((x) => x !== alert));
    }
  }

  function cssClasses(alert) {
    if (!alert) return;

    const classes = ["alert"];

    const alertTypeClass = {
      [AlertType.Info]: "alertInfo",
      [AlertType.Error]: "alertDanger",
      [AlertType.Success]: "alertSuccess",
      [AlertType.Warning]: "alertWarning",
    };

    classes.push(alertTypeClass[alert.type]);

    if (alert.fade) {
      classes.push("fadeOut");
    } else {
      classes.push("fadeIn");
    }

    return classes.map((_class) => styles[_class]).join(" ");
  }

  if (!alerts.length) return null;

  return (
    <div className={styles.alertContainer}>
      {alerts.map((alert, index) => {
        const children = (
          <>
            <div className={styles.alertContent}>
              <p className={styles.alertType}>{alert.type}</p>

              <p
                className={styles.alertMessage}
                dangerouslySetInnerHTML={{ __html: alert.message }}
              />
            </div>

            <div
              className={styles.alertClose}
              onClick={() => removeAlert(alert)}
            >
              <span>&times;</span>
            </div>
          </>
        );

        return (
          <div key={index} className={cssClasses(alert)}>
            {children}
          </div>
        );
      })}
    </div>
  );
}
