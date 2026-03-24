import type { TemplateDef, FunctionDef } from "@tari-project/ootle-indexer";

import { Network, TransactionBuilder } from "@tari-project/ootle";
import { DotLogo } from "./components.tsx";
type PublishedTemplateAddress = string; // todo export in indexer
interface TransactProps {
  def: TemplateDef;
  templateAddress: PublishedTemplateAddress;
  selectedFunction: FunctionDef;
}

const builder = new TransactionBuilder(Network.Esmeralda);
export default function Transact({ def, selectedFunction, templateAddress }: TransactProps) {
  console.debug(`def =`, def);
  console.debug(`selectedFunction =`, selectedFunction);
  const b = builder.callFunction(
    {
      templateAddress,
      functionName: selectedFunction.name,
    },
    selectedFunction.arguments,
  );
  console.debug(`b =`, b);

  return def ? (
    <div className="abi-view">
      <span className="fn-name mono">{def.V1.template_name}</span>
    </div>
  ) : (
    <div className="empty-detail">
      <DotLogo size={48} />
      <p>Select a function to transact</p>
    </div>
  );
}
