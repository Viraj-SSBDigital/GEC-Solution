import { useData } from "../../contexts/DataContext";
import { useAuth } from "../../contexts/AuthContext";
import { Layout } from "../../components/Layout";
import { TokenWallet } from "../../components/TokenWallet";

export const ConsumerWallet = () => {
  const { tokens } = useData();
  const { user } = useAuth();

  const userTokens = tokens.filter((t) => t.consumerId === user?.id);

  return (
    <Layout>
      <TokenWallet tokens={userTokens} title="My Token Wallet" />
    </Layout>
  );
};
