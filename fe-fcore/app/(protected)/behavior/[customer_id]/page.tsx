import BehaviorByCustomerClient from '../components/BehaviorByCustomerClient';

type PageProps = {
  params: Promise<{ customer_id: string }>;
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function BehaviorByCustomerPage({ params }: PageProps) {
  const { customer_id } = await params;
  return <BehaviorByCustomerClient customerId={customer_id} />;
}
