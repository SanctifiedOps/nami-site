// Match permanent IDs in the new column or Make's legacy Directory ID column.
export function findMemberSheetRow(headers: string[], rows: string[][], memberId: string): number {
  const memberIdColumn = headers.indexOf("Member ID");
  const directoryIdColumn = headers.indexOf("Directory ID");
  const matches = rows.flatMap((row, index) => {
    if (index === 0) return [];
    const memberIdMatch = memberIdColumn >= 0 && row[memberIdColumn] === memberId;
    const directoryIdMatch = directoryIdColumn >= 0 && row[directoryIdColumn] === memberId;
    return memberIdMatch || directoryIdMatch ? [index] : [];
  });
  if (matches.length > 1) throw new Error(`Multiple Sheet rows match member ${memberId}.`);
  const rowIndex = matches[0] ?? -1;
  if (rowIndex >= 1 && directoryIdColumn >= 0 && rows[rowIndex][directoryIdColumn] &&
    rows[rowIndex][directoryIdColumn] !== memberId) {
    throw new Error(`Sheet row for member ${memberId} has a different Directory ID.`);
  }
  return rowIndex;
}
