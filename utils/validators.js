export const isEmailValid = email => {
	const re = /\S+@\S+\.\S+/
	return re.test(email)
}

export const isPasswordValid = password => {
	return password.length >= 6
}
