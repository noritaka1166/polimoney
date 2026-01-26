import fs from 'node:fs/promises';
import path from 'node:path';
import { notFound } from 'next/navigation';
import { ElectionFinanceClient } from '@/components/election-finance/ElectionFinanceClient';
import type { EfData } from '@/models/election-finance';

type RouteParams = {
  name: string;
};

type Props = PageProps<'/election-finance/[name]'> & {
  params: Promise<RouteParams>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page(props: Props) {
  const { name } = await props.params;

  // Validate name to prevent directory traversal
  if (!/^[a-zA-Z0-9-]+$/.test(name)) {
    notFound();
  }

  const filePath = path.join(
    process.cwd(),
    'data',
    'election-finance',
    `ef-${name}.json`,
  );

  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(fileContent) as EfData;
    return <ElectionFinanceClient data={data} />;
  } catch (_error) {
    notFound();
  }
}
