import * as anchor from "@anchor-lang/core";
import { Program } from "@anchor-lang/core";
import { GaiaRecs } from "../target/types/gaia_recs";

describe("gaia_recs", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.gaiaRecs as Program<GaiaRecs>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
});
