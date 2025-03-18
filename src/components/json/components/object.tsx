import { FC } from "react";

import { CellValue } from "./views";
import { ObjectKey } from "@/utils/utility-types";

export const ObjectView: FC<{
  data: Record<ObjectKey, unknown>;
}> = ({ data }) => {
  return (
    <div>
      <span className="text-gray-600 dark:text-gray-400">{"{ "}</span>
      {Object.entries(data).map(([name, item], index, entries) => (
        <>
          <span>{name}</span>
          <span className="px-1 text-gray-600 dark:text-gray-400">:</span>
          <CellValue value={item} />
          {index !== entries.length - 1 && (
            <span className="text-gray-600 dark:text-gray-400">, </span>
          )}
        </>
      ))}
      <span className="text-gray-600 dark:text-gray-400">{" }"}</span>
    </div>
  );
};

// interface EntriesProps {
//   data: [unknown, unknown][];
//   braces?: "{}" | "[]" | "<>" | "()" | "||";
//   open?: ReactNode;
//   close?: ReactNode;
// }
// export const EntriesView: FC<EntriesProps> = ({
//   data,
//   braces = "{}",
//   open,
//   close,
// }) => {
//   const start = open ?? braces[0];
//   const end = close ?? braces[1];
//   return (
//     <div>
//       {typeof start === "string" ? (
//         <span className="text-gray-600 dark:text-gray-400">{`${start} `}</span>
//       ) : (
//         start
//       )}

//       {data.map(([name, value], index) => (
//         <>
//           {name && (
//             <>
//               <span>{name}</span>
//               <span className="px-1 text-gray-600 dark:text-gray-400">:</span>
//             </>
//           )}
//           <CellValue value={value} />
//           {index !== data.length - 1 && (
//             <span className="text-gray-600 dark:text-gray-400">, </span>
//           )}
//         </>
//       ))}
//       {typeof end === "string" ? (
//         <span className="text-gray-600 dark:text-gray-400">{` ${end}`}</span>
//       ) : (
//         end
//       )}
//     </div>
//   );
// };

// interface KeyValueProps {
//   name: unknown | unknown[];
//   value: unknown;
//   reichKeys?: boolean;
//   separator?: string;
//   comma?: string;
// }
// const KeyValue: FC<KeyValueProps> = ({
//   name,
//   value,
//   reichKeys,
//   comma = ",",
//   separator = ":",
// }) => {
//   return (
//     <>
//       {name && (
//         <>
//           <span>{name}</span>
//           <span className="px-1 text-gray-600 dark:text-gray-400">
//             {separator}
//           </span>
//         </>
//       )}

//       <CellValue value={value} />

//       {comma && (
//         <span className="text-gray-600 dark:text-gray-400">{`${comma} `}</span>
//       )}
//     </>
//   );
// };

// export const KeyValue: FC<PropsWithChildren> = ({ children }) => (
//   <>{children}</>
// );
// export const KeyValueKey: FC<PropsWithChildren> = ({ children }) => (
//   <>{children}</>
// );
// export const KeyValueSeparator: FC<{ separator: ReactNode }> = ({
//   separator = ":",
// }) =>
//   typeof separator === "string" ? (
//     <span className="px-1 text-gray-600 dark:text-gray-400">{separator}</span>
//   ) : (
//     separator
//   );
// export const KeyValueValue: FC<PropsWithChildren> = ({children}) =>
