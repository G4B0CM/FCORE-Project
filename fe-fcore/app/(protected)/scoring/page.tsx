import { cookies } from 'next/headers';
import ScoringPlayground from './components/ScoringPlayground';
import { customersService } from '@/services/customers.service';
import { merchantsService } from '@/services/merchants.service';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ScoringPage() {
  const at = (await cookies()).get('fcore.at')?.value ?? null;

  let customerOptions: { label: string; value: string }[] = [];
  let merchantOptions: { label: string; value: string }[] = [];

  try {
    const [customers, merchants] = await Promise.all([
      customersService.list(at),
      merchantsService.list(at),
    ]);

    customerOptions = customers.map(c => ({
      label: `${c.full_name} • ${c.document_number}`,
      value: String(c.id),
    }));

    merchantOptions = merchants.map(m => ({
      label: m.name ? `${m.name} • ${m.id}` : String(m.id),
      value: String(m.id),
    }));
  } catch {}

  return <ScoringPlayground customerOptions={customerOptions} merchantOptions={merchantOptions} />;
}
