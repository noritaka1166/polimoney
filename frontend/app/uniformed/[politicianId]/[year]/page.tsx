import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Main } from '@/components/uniformed/Main';
import { politicianDataMap } from '@/data/uniformed/politician-data';
import type { AccountingReports, Report } from '@/models/uniformed/type';

type RouteParams = {
  politicianId: string;
  year: string;
};

type Props = PageProps<'/uniformed/[politicianId]/[year]'> & {
  params: Promise<RouteParams>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getPoliticianData(politicianId: string, year: string) {
  const dataModule = (
    politicianDataMap as Record<
      string,
      {
        default: AccountingReports;
        getDataByYear: (year: number) => AccountingReports | null;
      }
    >
  )[politicianId];

  if (!dataModule?.getDataByYear) {
    return null;
  }

  const yearData = dataModule.getDataByYear(Number(year));
  if (!yearData) {
    return null;
  }

  const allReports: Report[] = dataModule.default.data.map(
    (d: { report: Report }) => d.report,
  );
  return {
    yearData,
    allReports,
  };
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { politicianId, year } = await props.params;
  const data = getPoliticianData(politicianId, year);

  if (!data) {
    return {
      title: 'データが見つかりません | Polimoney (ポリマネー)',
      robots: {
        index: false,
        follow: false,
        nocache: true,
      },
    };
  }

  return {
    title: `${data.yearData.profile.name} (${year}年) | Polimoney (ポリマネー)`,
    robots: {
      index: false,
      follow: false,
      nocache: true,
    },
  };
}

export default async function Page(props: Props) {
  const { politicianId, year } = await props.params;
  const data = getPoliticianData(politicianId, year);

  if (!data) {
    notFound();
  }

  const { yearData, allReports } = data;
  const reportData = yearData.data[0];

  return (
    <Main
      politicianId={politicianId}
      yearData={yearData}
      allReports={allReports}
      reportData={reportData}
    />
  );
}
