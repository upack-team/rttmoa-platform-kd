// import { useTableState, useTableSearch, useTableRequest, useTableModal } from '@/hooks/useTable';

// const useProTable = () => {
//   const actionRef = useRef<ActionType>();
//   const formRef = useRef<FormInstance>();
//   const [form] = Form.useForm();

//   const { loadingState, paginationState, schemaState } = useTableState();
//   const [loading, setLoading] = loadingState;
//   const [pagination, setPagination] = paginationState;
//   const [columnSchema, setColumnSchema] = schemaState;

//   const { autoSearch } = useTableSearch(actionRef);
//   const { handleRequest } = useTableRequest(api, setLoading, setColumnSchema, setPagination);
//   const modal = useTableModal(api, form, actionRef);

//   return (
//     <ProTable
//       actionRef={actionRef}
//       formRef={formRef}
//       loading={loading}
//       request={handleRequest}
//       onValuesChange={autoSearch}
//       // 其他配置...
//     />
//   );
// };
