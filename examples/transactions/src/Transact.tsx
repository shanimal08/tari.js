import { FunctionDef } from "@tari-project/ootle-indexer";
import { Network, TransactionBuilder } from "@tari-project/ootle";
import { DotLogo } from "./components.tsx";

interface TransactProps {
  selectedFunction: FunctionDef | null;
}

const builder = new TransactionBuilder(Network.Esmeralda);
export default function Transact({ selectedFunction }: TransactProps) {
  console.debug(`builder=`, builder);

  return selectedFunction ? (
    <div className="abi-view">
      <span className="fn-name mono">{selectedFunction.name}</span>
    </div>
  ) : (
    <div className="empty-detail">
      <DotLogo size={48} />
      <p>Select a function to transact</p>
    </div>
  );
}
