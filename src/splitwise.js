class priority_queue {
	queue = [];

	upheapify(idx) {
		if (idx === 0)
			return;
		let parent_idx = Math.floor((idx - 1) / 2);
		if (this.queue[parent_idx].val < this.queue[idx].val) {
			let temp = this.queue[idx];
			this.queue[idx] = this.queue[parent_idx];
			this.queue[parent_idx] = temp;
			this.upheapify(parent_idx);
		}
		return;
	}

	downheapify(idx) {
		let left_child = 2 * idx + 1;
		let right_child = 2 * idx + 2;

		if (left_child >= this.queue.length && right_child >= this.queue.length)
			return;

		let swap_idx = idx;

		if (left_child < this.queue.length && this.queue[swap_idx].val < this.queue[left_child].val) {
			swap_idx = left_child;
		}

		if (right_child < this.queue.length && this.queue[swap_idx].val < this.queue[right_child].val) {
			swap_idx = right_child;
		}

		if (swap_idx === idx)
			return;

		let temp = this.queue[idx];
		this.queue[idx] = this.queue[swap_idx];
		this.queue[swap_idx] = temp;
		this.downheapify(swap_idx);
		return;
	}

	empty() {
		return this.queue.length === 0;
	}

	push(val, name) {
		this.queue.push({ 'val': val, 'name': name });
		this.upheapify(this.queue.length - 1);
		return;
	}

	pop() {
		var i = this.queue.length - 1;
		this.queue[0] = this.queue[i];
		this.queue.pop();
		this.downheapify(0);
	}

	top() {
		return this.queue[0];
	}
}

function splitwise(data) {
	var netCreditDebit = {};
	for (var i = 0; i < data.length; i++) {
		var { payer, payee, amount } = data[i];


		if (payer in netCreditDebit) {
			netCreditDebit[payer] -= amount;
		}
		else {
			netCreditDebit[payer] = -1 * amount;
		}

		if (payee in netCreditDebit) {
			netCreditDebit[payee] += amount;
		}
		else {
			netCreditDebit[payee] = amount;
		}
	}

	// max heaps
	var pay = new priority_queue();
	var receive = new priority_queue();

	for (const k in netCreditDebit) {
		if (netCreditDebit[k] < 0) {
			receive.push(netCreditDebit[k] * -1, k);
		}
		else if (netCreditDebit[k] > 0) {
			pay.push(netCreditDebit[k], k);
		}
	}

	let nodeArr = [];
	let linkArr = [];
	let dict = {};

	while (pay.empty() === false && receive.empty() === false) {
		var p = pay.top();
		var r = receive.top();

		pay.pop();
		receive.pop();

		var payamount = p.val;
		var receiveamount = r.val;
		var transactamount = 0;

		if (payamount === receiveamount) {
			transactamount = payamount;
		}
		else if (payamount < receiveamount) {
			receiveamount -= payamount;
			receive.push(receiveamount, r.name);
			transactamount = payamount;
		}
		else {
			payamount -= receiveamount;
			pay.push(payamount, p.name);
			transactamount = receiveamount;
		}
		linkArr.push({ source: p.name, target:r.name, weight: transactamount });
		dict[p.name] = 1;
		dict[r.name] = 1;
	}
	for (let key in dict) {
		nodeArr.push({ id: key });
	}
	return { nodes: nodeArr, links: linkArr };
}

export default splitwise;