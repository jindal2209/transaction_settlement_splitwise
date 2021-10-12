import React, { useEffect, useState } from 'react';
import { Graph } from 'react-d3-graph';
import './App.css';
import splitwise from './splitwise';

function App() {
	var [data, setData] = useState([]);
	var [payer, setPayer] = useState('');
	var [payee, setPayee] = useState('');
	var [amount, setAmount] = useState('');
	var [objId, setObjId] = useState(1);
	var [graph, setGraph] = useState(null);
	var [simplifiedGraph, setSimplifiedGraph] = useState(null);

	function delData(id) {
		var arr = [...data];
		arr = arr.filter((obj) => {
			return obj.id !== id;
		})
		setData(prev => arr);
	}

	useEffect(() => {
		function generateConfigs() {
			let nodeArr = [];
			let linkArr = [];
			let dict = {};
			for (var i = 0; i < data.length; i++) {
				dict[data[i].payer] = 1;
				dict[data[i].payee] = 1;
				linkArr.push({ source: data[i].payer, target: data[i].payee, weight: data[i].amount });
			}
			for (let key in dict) {
				nodeArr.push({ id: key });
			}
			return { nodeArr: nodeArr, linkArr: linkArr };
		}

		function generateGraph() {
			if (data.length === 0) {
				setGraph(null);
				setSimplifiedGraph(null);
				return;
			}
			let { nodeArr, linkArr } = generateConfigs();
			var dataa = {
				nodes: nodeArr,
				links: linkArr
			};
			const myConfig = {
				freezeAllDragEvents: true,
				nodeHighlightBehavior: true,
				node: {
					color: "lightgreen",
					highlightStrokeColor: "blue",
					fontSize: 12,
					fontColor: 'white',
					labelPosition: 'top' 
				},
				link: {
					highlightColor: "lightblue",
					renderLabel: true,
					labelProperty: "weight",
					fontSize: 12,
					fontColor: 'white'
				},
				directed: true,
				height: 300,
				width: 600,
			};

			var g = <> <h4 className='text-center'>Graph</h4> <Graph
				id="graph-id-output" // id is mandatory
				data={dataa}
				config={myConfig}
			/> </>
			setGraph(g);

			var simplifiedData = splitwise(data);
			var g1 = <> <h4 className='text-center'>SimplifiedGraph</h4> <Graph
				id="graph-id-output" // id is mandatory
				data={simplifiedData}
				config={myConfig}
			/> </>
			setSimplifiedGraph(g1);
		}

		generateGraph()
	}, [data])

	function DataTile(props) {
		return (
			<tr>
				<td>{props.payer}</td>
				<td>{props.payee}</td>
				<td>{props.amount}</td>
				<td><button onClick={() => delData(props.id)} className="btn btn-outline-warning btn-sm"><i className="fas fa-trash"></i></button></td>
			</tr>
		)
	}

	function addData() {
		if (payer.trim() === '' || payee.trim() === '' || amount === '' || parseInt(amount) <= 0 || payer.trim().toLowerCase() === payee.trim().toLowerCase()) {
			alert("names cannot be same or empty (case insensitive) and amount cannot be 0 or negative")
			return;
		}
		setPayee(prev => prev.trim().toLowerCase());
		setPayer(prev => prev.trim().toLowerCase());
		setData(prev => [...prev, { 'id': objId, 'payer': payer, 'payee': payee, 'amount': parseInt(amount) }]);
		setPayee('');
		setPayer('');
		setObjId(prev => prev + 1);
		setAmount('');
	}

	return (
		<div className="App bgdark">
			<div className="container-fluid">
				<h1 className='text-center mb-5 pt-3 text-light'>Splitwise Transaction Settlement Algorithm <a href='https://github.com/jindal2209/transaction_settlement_splitwise' target='_blank' rel='noreferrer'><img className='float-end' src='https://jindal2209.github.io/Sorting_Visualizer/iff.png' alt='fork-on-github'/></a></h1>
				<div className="row">
					<div className="col-md-6 p-2">
						<table className='table table-dark table-bordered border-light table-hover table-responsive'>
							<thead className='text-center border-none'>
								<tr>
									<th>Payer</th>
									<th>Payee</th>
									<th>Amount</th>
									<th>Action</th>
								</tr>
								<tr>
									<td colSpan='5' className='text-muted p-1' style={{ 'fontSize': '11px' }}>Enter the transaction data (names are<b> not </b> case sensitive)</td>
								</tr>
								<tr>
									<td><input type='text' className='custom_input' value={payer} onChange={(e) => setPayer(e.target.value)} placeholder='enter payer' /></td>
									<td><input type='text' className='custom_input' value={payee} onChange={(e) => setPayee(e.target.value)} placeholder='enter payee' /></td>
									<td><input type='number' className='custom_input' value={amount} onChange={(e) => setAmount(e.target.value)} placeholder='enter amount' /></td>
									<td><button onClick={addData} className='btn fe-bold btn-outline-primary btn-sm'><i className="fas fa-plus-square"></i></button></td>
								</tr>
							</thead>
							<tbody className="text-center">
								{
									data.map((val, idx) => (
										<DataTile key={idx} payer={val.payer} payee={val.payee} amount={val.amount} id={val.id} />
									))
								}
							</tbody>
						</table>
					</div>
					<div className="col-md-6 p-2">
						{graph}
						<br />
						{simplifiedGraph}
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;
