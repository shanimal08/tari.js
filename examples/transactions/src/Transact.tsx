import type { TemplateDef, FunctionDef } from "@tari-project/ootle-indexer";

import { Network, TransactionBuilder, type UnsignedTransactionV1 } from "@tari-project/ootle";
import { DotLogo, getTypeAsString } from "./components.tsx";
import { useCallback, useState } from "react";
type PublishedTemplateAddress = string; // todo export in indexer
interface TransactProps {
  def: TemplateDef;
  templateAddress: PublishedTemplateAddress;
  selectedFunction: FunctionDef;
}

const builder = new TransactionBuilder(Network.Esmeralda);
export default function Transact({ def, selectedFunction, templateAddress }: TransactProps) {
  const [unsignedTx, setUnsignedTx] = useState<UnsignedTransactionV1 | null>(null);
  const handleFn = useCallback(() => {
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
  }, [selectedFunction.arguments, selectedFunction.name, templateAddress]);

  return def ? (
    <div className="abi-view">
      <span className="fn-name mono">{def.V1.template_name}</span>
      <button className="btn-ghost" onClick={handleFn}>
        Call {selectedFunction.name}
      </button>
      {unsignedTx && (
        <pre className="json-view">
          {JSON.stringify(unsignedTx, (key, value) => (key === "arg_type" ? getTypeAsString(value) : value), 2)}
        </pre>
      )}
    </div>
  ) : (
    <div className="empty-detail">
      <DotLogo size={48} />
      <p>Click a function to transact</p>
    </div>
  );
}
