const { Pool } = require("pg")

// create postgres conecction pool

const pool = new Pool({
	host: "localhost",
	user: "your_db_username",
	password: "your_db_password",
	database: "your_db_name",
	// port: 5432,
})

// connect to database
pool.connect((error, client) => {

	if (!error) {

		client.on("notification", ({ channel, payload, }) => {

			console.log("Emitted: " + channel.toUpperCase())
			console.table(JSON.parse(payload))
		})

		client.query("listen new_order")
	}
	else {
		console.error(error)
	}
})

setInterval(() => {

	// connect to database for insert data
	pool.connect((error, client) => {

		if (!error) {

			const INSERT = `

			insert into orders (
				order_fullname,
				order_gender,
				order_contact
			) values ($1, $2, $3)
			`

			client.query(INSERT, [
				"User_" + ((Math.random() * 100000) | 0), "m", "998998961000"
			])
		}
		else {
			console.error(error)
		}

		client.release()
	})

}, 3000)
