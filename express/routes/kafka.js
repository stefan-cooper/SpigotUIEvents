const { Router } = require("express");
const { Kafka } = require("kafkajs");
const router = Router();

const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({ groupId: Math.random().toString() });
let allNotifs = [];
consumer.connect();
consumer.subscribe({ topic: "all" });
consumer.run({
  eachMessage: async ({ topic, partition, message }) => {
    console.log(topic, message.value.toString());
    if (topic === "all")
      allNotifs.push({
        value: message.value.toString(),
        time: new Date().getTime(),
      });
    return true;
  },
});

router.get("/kafka_all", (req, res) => {
  if (req.query.time) {
    res.json(
      allNotifs
        .filter((notif) => notif.time > req.query.time)
        .map((notif) => notif.value)
    );
  } else {
    res.sendStatus(400);
  }
});

module.exports = router;
