import Table from "cli-table";
import multisort from "multisort";

//@TODO: Remove "any" with Zod schema
export const createTable = (data: any[]) => {
  const table = new Table({
    head: ["Repo", "Status", "Critical", "High", "Medium", "Low"],
    colWidths: [30, 10, 10, 10, 10, 10],
    style: {
      compact: true,
      head: ['blue'],
    }
  });

  const sortedData = multisort(data, [
    'status',
    '~critical',
    '~type',
    '~high',
    '~medium',
    '~low'
  ]).map((r: any) => [r.repo, r.status, r.critical, r.high, r.medium, r.low]);

  table.push(...sortedData);
  
  return {
    sortedData,
    table,
  }
}

export const renderTable = (data: any[]) => {
  const { table } = createTable(data);
  console.log(table.toString());
}
