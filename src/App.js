import { useCallback, useEffect, useState } from "react";

import "./App.css";
import axios from "axios";

const App = () => {
  const [notificationsSet, updateNotificationsSet] = useState(new Set());
  const [allNotificationsJson, updateAllNotificationsJson] = useState([]);
  const [latestResponse, setLatestResponse] = useState();
  const timeInterval = 1000;

  const [players, setPlayers] = useState({});

  const updateNotifs = (res) => {
    res.data
      .filter((notif) => !notificationsSet.has(JSON.parse(notif).id))
      .forEach((notification) => {
        const stringified = notification;
        notificationsSet.add(JSON.parse(notification).id);
        setLatestResponse(stringified);
      });

    updateNotificationsSet(notificationsSet);
  };

  const updateNotifications = () => {
    const timeCheck = new Date().getTime() - timeInterval;

    axios
      .get(`http://localhost:3001/api/kafka_all?time=${timeCheck}`)
      .then(updateNotifs);
  };

  useEffect(() => {
    if (latestResponse) {
      updateAllNotificationsJson([...allNotificationsJson, latestResponse]);
      const parsed = JSON.parse(latestResponse);
      setPlayers({
        ...players,
        [parsed.player]: {
          health: parsed.health,
          highlights: parsed.highlights
        },
      });
    }
  }, [latestResponse]);

  useEffect(() => {
    setInterval(() => {
      updateNotifications();
    }, timeInterval);
  }, []);

  const renderPlayer = (name, player) => {
    const renderHearts = (remainingHealth) => {
      let jsx = [];
      let fullHearts = [];
      let halfHearts =
        remainingHealth % 2 !== 0 && remainingHealth > 0
          ? [<img className="heart" src={require("./assets/half_heart.png")} />]
          : [];
      let emptyHearts = [];

      let hearts = Math.floor(remainingHealth / 2);

      for (let health = 0; health < 10 - halfHearts.length; health++) {
        if (health < hearts) {
          fullHearts.push(
            <img className="heart" src={require("./assets/full_heart.png")} />
          );
        } else {
          emptyHearts.push(
            <img className="heart" src={require("./assets/empty_heart.png")} />
          );
        }
      }

      return jsx.concat(fullHearts, halfHearts, emptyHearts);
    };

    const renderInventoryHighlights = (highlights) => {
      let jsx = []
      if (highlights) {
        if (highlights.includes("GOLDEN_APPLE")) {
          jsx.push(<img className="invitem" src={require("./assets/GoldenApple.webp")} />)
        }
        if (highlights.includes("DIAMOND_SWORD")) {
          jsx.push(<img className="invitem" src={require("./assets/DiamondSword.webp")} />)
        }
        if (highlights.includes("ENCHANTED_GOLDEN_APPLE")) {
          jsx.push(<img className="invitem" src={require("./assets/EnchantedGoldenApple.webp")} />)
        }
        if (highlights.includes("TNT")) {
          jsx.push(<img className="invitem" src={require("./assets/TNT.webp")} />)
        }
      }
      return <div className="inventory">{jsx}</div>
    }

    return (
      <div>
        <h3>{name}</h3>
        {renderHearts(player.health)}
        {renderInventoryHighlights(player.highlights)}
      </div>
    );
  };

  return (
    <>
      <div className="App">
        <header className="App-header">
          {JSON.stringify(players) !== "{}" &&
            Object.entries(players).map(([name, player]) =>
              renderPlayer(name, player)
            )}
        </header>
      </div>
    </>
  );
};

export default App;
