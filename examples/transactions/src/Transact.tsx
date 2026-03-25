import type { TemplateDef, FunctionDef } from "@tari-project/ootle-indexer";

import { Network, TransactionBuilder, type UnsignedTransactionV1 } from "@tari-project/ootle";

import { getInputType, getTypeAsString } from "./components.tsx";
import { useCallback, useMemo, useState } from "react";
import { EphemeralKeySigner } from "@tari-project/ootle-secret-key-wallet";
type PublishedTemplateAddress = string; // todo export in indexer
interface TransactProps {
  def: TemplateDef;
  templateAddress: PublishedTemplateAddress;
  selectedFunction: FunctionDef | null;
}

//{JSON.stringify(unsignedTx, (key, value) => (key === "arg_type" ? getTypeAsString(value) : value), 2)}

export function Transact({ def, selectedFunction, templateAddress }: TransactProps) {
  const s = EphemeralKeySigner.generate();
  const b = new TransactionBuilder(Network.Esmeralda);

  const [pubKey, setPubKey] = useState<Uint8Array | null>(null);
  const [address, setAddress] = useState<string | null>(null);

  async function getSignerDetails() {
    s.getPublicKey().then((pk) => setPubKey(pk));
    s.getAddress().then((addr) => setAddress(addr));
  }
  async function createAccount() {
    if (pubKey) {
      b.createAccount(pubKey);
    }
  }

  return (
    <div className="tx-view">
      <h2>
        Transact with <code>EphemeralKeySigner</code>
      </h2>
      <hr />
      <div className="btn-group">
        <button className="btn-ghost small" onClick={getSignerDetails}>
          Get Signer Public Key & Address
        </button>
        {pubKey && (
          <button className="btn-ghost small" onClick={createAccount}>
            Create Account
          </button>
        )}
      </div>
      {pubKey && <div className="address-chip">{pubKey}</div>}
      {address && <div className="address-chip">{address}</div>}
      <hr />
      <div>
        <h4>Build a transaction:</h4>
      </div>
    </div>
  );
}
