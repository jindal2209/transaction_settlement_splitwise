#include<iostream>
#include<string>
#include<unordered_map>
#include<queue>
using namespace std;

int main() {
	unordered_map<string, vector<pair<string, int>>> graph;
	// taking inputs and calculating net credit or debit
	unordered_map<string, int> netCreditDebit;
	cout << "Enter transactions (from to amount)  (enter 'stop' to stop taking input)\n";
	string from , to;
	int amount ;
	cin >> from;
	while (from != "stop") {
		cin >> to >> amount;
		graph[from].push_back(make_pair(to, amount));
		netCreditDebit[from] -= amount;  // he has given amount
		netCreditDebit[to] += amount;	// he has to pay amount

		cin >> from;
	}

	priority_queue<pair<int, string>> pay;
	priority_queue<pair<int, string>> receive;

	for (auto pa : netCreditDebit) {
		if (pa.second < 0) { // he has to receive money
			receive.push(make_pair(-pa.second, pa.first));
		}
		else if (pa.second > 0) {
			pay.push(make_pair(pa.second, pa.first));
		}
	}

	while (!receive.empty() && !pay.empty()) {
		auto p = pay.top();
		auto r = receive.top();
		pay.pop();
		receive.pop();
		int payamount = p.first;
		int receiveamount = r.first;
		int transactamount = 0;
		if (payamount == receiveamount) {
			transactamount = payamount;
		}
		else if (payamount < receiveamount) {
			receiveamount -= payamount;
			receive.push(make_pair(receiveamount, r.second));
			transactamount = payamount;
		}
		else {
			payamount -= receiveamount;
			pay.push(make_pair(payamount, p.second));
			transactamount = receiveamount;
		}
		cout << p.second << " pays " << transactamount << " to " << r.second << endl;

	}

	return 0;
}