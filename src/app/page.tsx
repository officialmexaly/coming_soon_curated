import { ComingSoonHero } from '@/components/ComingSoonHero';
import { getCountdownPayload } from '@/lib/countdown';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const countdownState = await getCountdownPayload();

  return (
    <main className="h-[100svh] w-full overflow-hidden bg-black">
      <ComingSoonHero initialCountdownState={countdownState} />
    </main>
  );
}
