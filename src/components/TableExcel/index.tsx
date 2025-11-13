import { Button, Dropdown, Tooltip, Upload, UploadFile } from 'antd';
import { useState } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { message } from '@/hooks/useMessage';
import { DeleteOutlined, EditOutlined, EyeOutlined, QuestionCircleTwoTone } from '@ant-design/icons';

// const tableHeaders = ['序号', '学科', '项目名称', '端', '账号', '密码'];

/* <Excel
  TableName='用户管理'
  setFileName={setFileName}
  ExportTableData={dataSource} // 接口数据：所有表数据
  tableHeaders={column.map((value: any) => value.title)} // 表头数据
  fakeData={FakeData}
>
  <Button icon={<SettingOutlined className='hover:cursor-pointer' />}>Excel Setting</Button>
</Excel> */

interface ExcelProps {
	TableName: string; // 导出文件名：用户管理
	tableHeaders: string[]; // 表头名称：['序号', '学科', '项目名称', '端', '账号', '密码'];  需传递此种格式
	ExportData: Array<any>[]; // 导出表格数据
	ImportData: (data: any) => void; // 导入表格数据结果
	children: any;
}
// ! 上传完毕后：还需要记录上传的文件信息（导入表格记录表）
export default function Excel(Props: ExcelProps) {
	const {
		TableName, // 导出文件名：用户管理
		// fileName,
		tableHeaders, // 表头名称：['序号', '学科', '项目名称', '端', '账号', '密码'];  需传递此种格式
		ExportData, // 导出表格数据
		ImportData, // 导入表格数据结果
		children,
	} = Props;

	const [tableLoading, setTableLoading] = useState<boolean>(false); // 加载状态：Loading
	const [fileName, setFileName] = useState<string>(''); // 文件名称： __EXCEL__黑马账号信息.xlsx
	const [fileList, setFileList] = useState<UploadFile[]>([]);

	// ! 导入表格数据
	// 参数设置   (file:文件 Blob类型,sheetName:工作区名称 string类型)
	const handleUpload = (file: any) => {
		let fileObj = {
			uid: file.uid,
			name: file.name,
			size: file.size,
			type: file.type,
		};

		const isExcel = /\.(xlsx|xls)$/.test(file?.name.toLowerCase());
		if (!isExcel) {
			message.error('请上传Excel文件（.xlsx 或 .xls）');
			setFileList([...fileList, { ...fileObj, status: 'error' }]);
			return false;
		}
		setFileName(file.name);
		setTableLoading(true);
		const reader = new FileReader(); // 异步读取文件
		reader.onload = (e: any) => {
			const data = new Uint8Array(e.target.result); // 格式化数组
			const workbook = XLSX.read(data, { type: 'array' }); // 读取文件内容
			const worksheet = workbook.Sheets[workbook.SheetNames[0]]; //  ['Sheet1']: 指的是工作区一
			const jsonData: any = XLSX.utils.sheet_to_json(worksheet, { header: 1 }); // 将工作表数据转换为 JSON 格式
			// console.log('jsonData', jsonData); // ! 这里就是所有的表格数据了

			if (jsonData == 0) {
				message.warning('导入错误：表格无数据');
				setTableLoading(false);
				setFileList([...fileList, { ...fileObj, status: 'error' }]);
				return false;
			}
			// 验证表头字段
			const headers = jsonData[0] || [];
			const missingHeaders = tableHeaders.filter((h: any) => !headers.includes(h));
			if (missingHeaders.length > 0) {
				message.error(`导入失败：缺少字段：${missingHeaders.join('、')}`);
				setFileList([...fileList, { ...fileObj, status: 'error' }]);
				return false;
			}
			const tableDataRes: any[] = [];
			// 第一行默认认为是表头 除开第一行以外都是数据
			jsonData.slice(1).forEach((item: any, itemIndex: number) => {
				if (item.length === 0) return false;
				const obj: any = { key: itemIndex };
				jsonData[0].forEach((header: any, index: any) => {
					obj[header] = item[index];
				});
				tableDataRes.push(obj);
			});
			console.log('tableData', tableDataRes); // ! 最终表格数据

			if (tableDataRes.length == 0) {
				message.warning('导入错误：表格无数据');
				setTableLoading(false);
				setFileList([...fileList, { ...fileObj, status: 'error' }]);
				return false;
			} else {
				ImportData && ImportData(tableDataRes);
				setFileList([...fileList, { ...fileObj, status: 'done' }]);
			}
			// // 设置表头
			// setColumns(columns);
			// // 设置数据
			// setTableData(tableDataRes);
			// ! 将数据传过去、传至接口中
			// 取消表格加载状态
			setTableLoading(false);
			return true;
		};
		reader.readAsArrayBuffer(file);
	};

	const ImportAdvanced = () => {
		message.info('正在开发中');
	};

	// * 导出模板
	// ! 传参：expectedHeaders表头信息
	const exportTemplate = () => {
		// const tableHeaders = ['序号', '学科', '项目名称', '端', '账号', '密码'];
		const columnConfig = tableHeaders.map((value: any) => value.title);

		// 1. 构造一个空的 worksheet，只包含表头
		const ws = XLSX.utils.aoa_to_sheet([tableHeaders]);

		// 2. 创建 workbook
		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

		// 3. 生成并导出
		const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
		const blob = new Blob([wbout], { type: 'application/octet-stream' });

		saveAs(blob, `${TableName}模板.xlsx`);
	};

	// * 导出表格
	const handleExport = () => {
		if (!ExportData.length) return message.warning('暂无数据可导出');

		const worksheet = XLSX.utils.json_to_sheet(ExportData);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

		const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
		const fileBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
		saveAs(fileBlob, `导出${TableName}数据.xlsx`);
	};

	const menuList = [
		{
			key: '1',
			label: (
				<div>
					<Upload beforeUpload={handleUpload} fileList={fileList}>
						{/* 提示：只导入工作区是 Sheet1 的数据 */}
						<Button key='view' type='text' size='middle' icon={<EyeOutlined />}>
							导入表格数据
							<Tooltip title='向表格中导入数据、先下载模板并导入！'>
								<span>
									<QuestionCircleTwoTone />
								</span>
							</Tooltip>
						</Button>
					</Upload>
				</div>
			),
		},
		{
			key: '2',
			label: (
				<div>
					{/* 提示：只导入工作区是 Sheet1 的数据 */}
					<Button key='view' type='text' size='middle' icon={<EyeOutlined />} onClick={ImportAdvanced}>
						导入表格数据高级设置
						<Tooltip title='设置是否去重、根据字段去更新还是新增'>
							<span>
								<QuestionCircleTwoTone />
							</span>
						</Tooltip>
					</Button>
				</div>
			),
		},
		{
			key: '3',
			label: (
				<Button key='edit' type='text' size='middle' icon={<EditOutlined />} onClick={exportTemplate}>
					导出表格模板
					<Tooltip title='模板格式、按格式去导入！'>
						<span>
							<QuestionCircleTwoTone />
						</span>
					</Tooltip>
				</Button>
			),
		},
		{
			key: '4',
			label: (
				<Button key='delete' type='text' size='middle' icon={<DeleteOutlined />} onClick={handleExport}>
					导出表格数据
					<Tooltip title='导出表格中所有的数据！'>
						<span>
							<QuestionCircleTwoTone />
						</span>
					</Tooltip>
				</Button>
			),
		},
	];
	return (
		<>
			<Dropdown
				menu={{
					items: menuList,
				}}
				placement='bottom'
				arrow={{ pointAtCenter: true }}
				trigger={['click']}
			>
				<div className='more-button-item'>
					{/* <SettingOutlined className='hover:cursor-pointer' /> */}
					{Props.children}
				</div>
			</Dropdown>
		</>
	);
}
