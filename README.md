# ivp
For the semester project in the module "Implementierung von Prozessen"

# List of new features and additions

## Camunda: Set the server IP variable “ipman”

- As mentioned, the external IP address of the generated Google Cloud VM Instance (35.233.57.207) is available to be used in any scenario.
- In case of any mishaps, the REST-API can be used locally using the value of the variable “ipman” to be set as “localhost”. The port is 44000.

## Camunda: Generating some random names

- This activity enables the user to have some random names available in case of rigorous testing, so one doesn’t need to write a name for the customer every time the process is launched.

## Custom Data banks for various hotels

- Separate folders with the names of the cities contain the hotel information in separate JSON data banks.
- These hotel data banks provide information about each hotel room, the total number of rooms in a hotel, types of rental cars available, and train ticket information.
- The reason for having such data banks is to ensure that the data and the information are always offline and at hand.
- Through good programming practices, Camunda is made to communicate with these data banks, making it possible to directly and quickly save or remove customers in the data banks.
- This also ensures that the data is always safe, irrespective of the server’s uptime or availability.

## Provide general information about the room prices and the hotel address

- The selected hotel information is made user-friendly by providing general information about room prices and the hotel address.
- The added VAT percentage is also mentioned, for example, it is 19% for the booking of the room as per the law (As long as the breakfast is included, the room price has to be around 19%).

## Date Calculations

- When the user inputs the check-in date and the check-out date, there are some formatting issues with Camunda, as it processes the dates in a different format which cannot be directly used as proper “dates” type in the server.
- To solve this error, custom code is written directly in Camunda using JavaScript as a scripting language and in the server.
- The user inputs the date, which is then converted into a string, and then is sent to the API using a GET method.
- This date is then processed accordingly and is saved in the JSON data bank of the hotel.
- This ensures that wherever the dates are seen, they can be read by humans as proper dates and are also saved as such.
- The conversion of the date from Camunda takes place by converting the date in the ISO-8601 format first to extract the number of milliseconds into a proper date in the server.

## Booking more hotel rooms using loop-activity

- This makes the process more granular and is made possible by setting the loop cardinality of the room booking subprocess equal to the number of rooms desired by the customer.

## Automatic discount eligibility

- If the customer decides not to take any travel packages (like basic, pro, and promax) and still fulfills the requirements of a travel package, an automatic discount is applied, because discounts are always desired.
- For instance, if the customer books a 2nd class train ticket in addition to a hotel room (assuming that the customer did not choose any travel package before), then a 5% discount is applied automatically while informing the customer.

## Travel package Upgrade Options

- A customer is always asked if the current travel package is to be upgraded or not through very user-friendly messages.
- For instance, a pro package holder can upgrade to a promax package just by booking a deluxe type rental car.
- Additional prices are applied along with the additional discounts.

## Additional Activities like City Tour, etc

- This part of the process is handled intricately:
  - It is asked if the customer wants to book such activities.
  - A custom website is made so that the customers in the travel agency can have a basic look at the available prices, options, and partner companies in various cities.
  - Additionally, the website also acts as a landing page for our travel agency and all sorts of important information can be obtained there.
  - A custom JSON data bank is made into every city folder called ‘tours.json’ which contains the details about the partner companies, their offers, and the prices they are charging for such activities.
  - Information is obtained from this JSON data bank and then displayed or processed using the variables directly within Camunda.

## Showing final details of the offer

- This intermediate step enables the customer to see all sorts of information that is provided, in addition to the total price to be paid, and to overall counter-check everything.
- This helps the user-friendliness of the project to a greater degree since the customer has the option to move further or terminate the booking.
- This step is implemented with customer satisfaction in mind.

## Cancellation if required

- If the customer is not satisfied with the booking so far, he/she can terminate the process.
- This is enabled using a signal event which can start the process again if there are any issues with the booking.

## Interest percentages in installments

- Proper steps have been taken to ensure that interest is calculated if the customer decides to go for the installments option.
- These are then calculated and added to the final price towards the end.

## Generating some random credit score

- Since there is no apparent access to the credit score of the customer, some random credit scores have been generated within the commander model using JavaScript as the scripting language.
- This can be helpful when checking the process rigorously.
- The decision to accept the credit check stays with the Filialleiter but still it is a proof of concept that this step can be automated, provided there is access to the credit score of the customer and the minimum required credit score is set.

## Ask the customer to pay directly if the Bonitätsprüfung fails

- Through this step, the customer can directly and easily pay in case the Bonitätsprüfung fails.
- Thus, no previously provided information is lost and the room can still be booked.

## Asking for the payment option like cash, card, PayPal, etc

- This was necessary since the required information to be displayed in the invoice has to have a payment method (according to the Law) which shows clearly how the payment is made.

## Generate Invoice Entries

- This is an important step in the process to finalize all the details obtained and processed so far.
- Creating an Invoice Entry in the ‘invoices.json’ file. This is for record keeping for the travel agency.
- Every important information about the customer like the hotel chosen, partners providing additional activities, rental car options, etc. is stored here.

## Generating an Invoice Number

- A custom algorithm has been made to generate a very specific type of invoice number for the customer.
- It consists of three parts: “ABCD-EFGH-0000” where:
  - A represents the first letter of the first name of the customer.
  - BCD represents the first three letters of the second name of the customer.
  - EF represents the location. For example, Berlin would be encoded as BE here.
  - GH represents the hotel. For example, hotel Omega would be encoded as OM here.
  - 0000 represents the number of instances. If there are two customers who have the same names, same location, and the same hotel, then the first customer will get 0001 and the second customer will get 0002 as invoice numbers.
- This solves the problem of never having two or more customers assigned the same invoice numbers, which happens usually.
- The reason for this algorithm is that randomly generating alphanumeric strings will never be readable by humans.
- With user-friendliness in mind, such an invoice number is generated which delivers all sorts of information about the customer and the booking.
- This will also be easy to find in case one looks for a specific invoice number in the invoices.json entries.

## Generate an Invoice Bill using HTML

- An HTML invoice bill is generated as the last step of the process.
- HTML is responsive and is custom-made for this application and can be easily printed.
- It contains important information such as the customers’ choices for the room, hotel, etc., while also including important tax-related information.
- It also specifies the VAT included for each item of purchase.

## Camunda: Error Handling

- To check if the location information is accurate corresponding to the hotel. That means if a hotel is in Berlin, the location cannot be set to Hannover or Erlangen.
- To check if the number of guests inputted by the user is not zero or negative. This is handled using if-statements and a variable which allows the process to move forward in case of an error in the script activity with JavaScript as the scripting language. If there are any errors, a user-friendly message is displayed. A rollback then takes place.
- To check if the number of rooms to be booked by the user is a non-zero positive integer. This is handled using if-statements and a variable which allows the process to move forward in case of an error in the script activity with JavaScript as the scripting language. If there are any errors, a user-friendly message is displayed. A rollback then takes place.
- To check if the number of rooms to be booked by the user is actually available. In case the user inputs a number more than the number of rooms available in the hotel, a user-friendly message is displayed. A rollback then takes place.
- To check if the number of days (stored in the variable ‘nights’) is a proper positive nonzero integer. If the check-in date comes after the check-out date, the variable ‘nights’ becomes non-positive which then is expressed as an error to the user through a user-friendly message. A rollback then takes place.
- To check if only a single room is selected by 2 or more guests. This means that for more than 1 guest, a single type room won’t be available for booking. A single room is meant to be occupied by a single guest and if 2 or more guests book 1 single type room, an error is displayed through a user-friendly message. A rollback then takes place to make the process start again through a signal throwing event called “restartProcess”. This thrown event is then caught by the start signal event of the process.
- To check if any ‘strange’ values are inputted by the Service-Mitarbeiter when he/she writes a room number in the text field. By strange values, we mean any room number which is not displayed in the available room list. For instance, if only room numbers 100, 101, 102, etc. are available then the Service-Mitarbeiter should not put numbers like 99, 98, etc. In case of an error, a user-friendly message is displayed and then a rollback takes place.
- Using direct signals to model the error-handling and begin the process again in case of an error, instead of complicated gateways and boundary events.
- The signal event “checkSignal” checks for the flags in case of errors generated, for example, the signal “restartProcess”.

