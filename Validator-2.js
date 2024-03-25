const fs = require("fs");
const readline = require("readline");
const validator = require("validator");

// membuat cli untuk menerima IO
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function getUserInfoAwait() {
    
    // menanyakan pertanyaan dengan validasi
    function askQuestion(question, validatorFn, errorMessage) {
        return new Promise((resolve) => {
            rl.question(question, (answer) => {
                // jika tidak membutuhkan validasi, atau format jawaban valid, kembalikan jawaban
                if (validatorFn == null || validatorFn(answer)) {
                    resolve(answer);
                } else { // jika membutuhkan validasi, namun format jawaban tidak valid, tanya lagi hingga valid
                    console.log(errorMessage);
                    resolve(askQuestion(question, validatorFn, errorMessage));
                }
            });
        });
    }

    // untuk menghandle error agar program tetap berjalan saat error
    try {
        // meminta masukan berupa nama, no. telp, dan email
        const name = await askQuestion(
            'What is your name? ',
            null,
            'Name: wrong format, your name must contain only alphabets'
        );
        const phoneNumber = await askQuestion(
            'What is your phone number? ',
            (input) => validator.isMobilePhone(input, 'id-ID'),
            'Phone number: wrong format, your phone number must be an Indonesian number'
        );
        const email = await askQuestion(
            'What is your email? ',
            (input) => validator.isEmail(input),
            'Email: wrong format, enter input again!'
        );
        const contact = {name, phoneNumber, email};
        
        // menambahkan kontak baru ke json
        const file = fs.readFileSync("./data/contacts.json", "utf8");
        const contacts = JSON.parse(file);
        contacts.push(contact);
        fs.writeFileSync("./data/contacts.json", JSON.stringify(contacts));
        console.log("Terimakasih sudah memasukkan data")
    } catch (error) {
        console.error('An error occurred:', error.message);
    } finally {
        rl.close();
    }
}

// Usage
module.exports = { getUserInfoAwait };