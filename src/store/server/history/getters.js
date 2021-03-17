export default {

	getTotalPrintTime(state) {
		let output = 0

		state.jobs.forEach(current => {
			output += current.print_duration
		})

		return output
	},

	getTotalCompletedPrintTime(state) {
		let output = 0

		state.jobs.forEach(current => {
			if (current.status === "completed") output += current.print_duration
		})

		return output
	},

	getLongestPrintTime(state) {
		let output = 0

		state.jobs.forEach(current => {
			if (current.print_duration > output) output = current.print_duration
		})

		return output
	},

	getTotalFilamentUsed(state) {
		let output = 0

		state.jobs.forEach(current => {
			output += current.filament_used
		})

		return output
	},

	getTotalJobsCount(state) {
		return state.jobs.length
	},

	getTotalCompletedJobsCount(state) {
		return state.jobs.filter(job => job.status === "completed").length
	},

	getAvgPrintTime(state, getters) {
		const totalCompletedPrintTime = getters.getTotalCompletedPrintTime
		const totalCompletedJobsCount = getters.getTotalCompletedJobsCount

		return totalCompletedPrintTime > 0 && totalCompletedJobsCount > 0 ? Math.round(totalCompletedPrintTime / totalCompletedJobsCount) : 0
	},

	getAllPrintStatusArray(state) {
		let output = []

		state.jobs.forEach(current => {
			const index = output.findIndex(element => element.name === current.status)
			if (index !== -1) output[index].value +=1
			else {
				let itemStyle = {
					opacity: 0.9,
					color: '#212121'
				}

				switch (current.status) {
					case 'completed':
						itemStyle['color'] = '#BDBDBD'
						break

					case 'in_progress':
						itemStyle['color'] = '#EEEEEE'
						break

					case 'cancelled':
						itemStyle['color'] = '#424242'
						break
				}

				output.push({
					name: current.status,
					value: 1,
					itemStyle: itemStyle,
					label: {
						color: '#fff'
					}
				})
			}
		})

		return output
	},

	getFilamentUsageArray(state) {
		let output = []
		const startDate = new Date(new Date().getDate() - 14)
		const jobsFiltered = state.jobs.filter(job => job.start_time * 1000 >= startDate && job.filament_used > 0)

		if (jobsFiltered.length) {
			jobsFiltered.forEach(current => {
				const currentStartDate = new Date(current.start_time * 1000).setHours(0,0,0,0)
				const index = output.findIndex(element => element[0] === currentStartDate)
				if (index !== -1) output[index][1] += Math.round(current.filament_used) / 1000
				else
					output.push([
						currentStartDate,
						Math.round(current.filament_used) / 1000
					])
			})
		}

		return output.sort((a,b) => {
			return b[0] - a[0]
		})
	},

	getPrinttimeAvgArray(state) {
		let output = [0,0,0,0,0]
		const startDate = new Date(new Date().getDate() - 14)
		const jobsFiltered = state.jobs.filter(job => job.start_time * 1000 >= startDate && job.status === 'completed')

		if (jobsFiltered.length) {
			jobsFiltered.forEach(current => {
				if 		(current.print_duration > 0 		&& current.print_duration <= 60*60*2) 	output[0]++
				else if (current.print_duration > 60*60*2 	&& current.print_duration <= 60*60*6) 	output[1]++
				else if (current.print_duration > 60*60*6 	&& current.print_duration <= 60*60*12) 	output[2]++
				else if (current.print_duration > 60*60*12 	&& current.print_duration <= 60*60*24) 	output[3]++
				else if (current.print_duration > 60*60*24) 										output[4]++
			})
		}

		return output
	}
}