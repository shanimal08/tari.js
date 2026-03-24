import type { TemplateDef, FunctionDef } from "@tari-project/ootle-indexer";

import { Network, TransactionBuilder, type UnsignedTransactionV1 } from "@tari-project/ootle";

import { DotLogo, getInputType, getTypeAsString } from "./components.tsx";
import { useCallback, useMemo, useState } from "react";
import { EphemeralKeySigner } from "@tari-project/ootle-secret-key-wallet";
type PublishedTemplateAddress = string; // todo export in indexer
interface TransactProps {
  def: TemplateDef;
  templateAddress: PublishedTemplateAddress;
  selectedFunction: FunctionDef;
}

export function Transact({ def, selectedFunction, templateAddress }: TransactProps) {
  const builder = useMemo(() => new TransactionBuilder(Network.Esmeralda), []);
  const [unsignedTx, setUnsignedTx] = useState<UnsignedTransactionV1 | null>(null);

  const buildUnsigned = useCallback(() => {
    builder.callFunction(
      {
        templateAddress,
        functionName: selectedFunction.name,
      },
      selectedFunction.arguments,
    );
    const unsigned = builder.buildUnsignedTransaction();

    if (unsigned) {
      setUnsignedTx(unsigned);
    }
  }, [builder, selectedFunction.arguments, selectedFunction.name, templateAddress]);

  const signTx = useCallback(async () => {
    if (!unsignedTx) return;

    const signer = EphemeralKeySigner.generate();

    const bla = await signer.signTransaction(unsignedTx);

    console.debug(`bla =`, bla);
  }, [unsignedTx]);

  const argInputs = selectedFunction.arguments.map((arg) => {
    if (arg.name === "self") return;
    const inputType = getInputType(getTypeAsString(arg.arg_type));
    return (
      <div key={`${arg.name}_${arg.arg_type}`} className="abi-view">
        <label htmlFor={`${arg.name}_${arg.arg_type}`} className="arg-input-label">
          {arg.name}
        </label>
        <input
          name={`${arg.name}_${arg.arg_type}`}
          className="arg-input"
          type={inputType}
          placeholder={inputType === "text" ? arg.name : "123"}
        />
      </div>
    );
  });

  return def ? (
    <div className="abi-view">
      <span className="fn-name mono">{def.V1.template_name}</span>
      <br />
      {argInputs}
      <br />
      <button className="btn-ghost" onClick={buildUnsigned}>
        Build <code>{selectedFunction.name}</code>
      </button>

      {unsignedTx && (
        <>
          <div style={{ maxHeight: 300 }}>
            <pre className="json-view">
              {JSON.stringify(unsignedTx, (key, value) => (key === "arg_type" ? getTypeAsString(value) : value), 2)}
            </pre>
          </div>
          <button className="btn-ghost" onClick={signTx}>
            Sign Transaction
          </button>
        </>
      )}
    </div>
  ) : (
    <div className="empty-detail">
      <DotLogo size={48} />
      <p>Click a function to transact</p>
    </div>
  );
}
