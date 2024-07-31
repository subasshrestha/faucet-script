const fs = require("fs");
const createRandomWallet = require("./wallet");
const { default: axios } = require("axios");

const totalWallets = 200000;

const getSavedWallets = () => {
  try {
    return fs
      .readFileSync("./out/wallets.csv", "utf8")
      .split("\n")
      .map((line) => {
        const [address, privateKey] = line.split(",");
        return { address, privateKey };
      })
      .slice(1);
  } catch (e) {
    return [];
  }
};

(async () => {
  fs.existsSync("./out") || fs.mkdirSync("./out");
  if (
    !fs.existsSync("./out/tx.csv") ||
    !fs.readFileSync("./out/tx.csv", "utf8").includes("transactions")
  ) {
    fs.writeFileSync("./out/tx.csv", "transactions");
  }
  if (
    !fs.existsSync("./out/wallets.csv") ||
    !fs.readFileSync("./out/wallets.csv", "utf8").includes("wallet,privateKey")
  ) {
    fs.writeFileSync("./out/wallets.csv", "wallet,privateKey");
  }
  while (true) {
    try {
      const savedWallets = getSavedWallets();
      let wallet = createRandomWallet();
      if (savedWallets.length > totalWallets) {
        wallet = savedWallets[Math.floor(Math.random() * savedWallets.length)];
      }
      const { data } = await axios.post(
        `https://faucet.testnet.suzuka.movementlabs.xyz/mint?address=${wallet.address}&amount=100000000000`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(`Claim Hash: 0x${data[0]}`);
      if (!data[0]) {
        continue;
      }
      fs.appendFileSync("./out/tx.csv", `\n0x${data[0]}`);
      if (savedWallets.length < totalWallets) {
        fs.appendFileSync(
          "./out/wallets.csv",
          `\n${wallet.address},${wallet.privateKey}`
        );
      }
    } catch (e) {
      console.error(e?.message);
      await new Promise((r) => setTimeout(r, 10000));
    }
  }
})();
