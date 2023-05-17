const nodemailer=require("nodemailer");
const transport=nodemailer.createTransport({
    service : "Gmail",
    auth:{
        user:"classyy2023@gmail.com",
        pass:"ohbeyivapbqwhdyv"
    },
});
module.exports.sendConfirmationEmail=(email,mdp)=>{
    transport 
    .sendMail({
        from :"classy2023@gmail.com",
        to:email,
        subject:"Login et mdp",
        html:`<h2> Bienvenue chez Classy</h2>
        <h4>Login :</h4> ${email}
        <h4>PassWord : </h4>${mdp}
        <p>Merci de confirmer votre compte en cliquant sur ce lien</p>
        <a href=http://localhost:3000/confirmation> Cliquer ici ! </a>`
    })
    .catch((err)=>console.log(err));
}
module.exports.sendConfirmation=(email,id)=>{
    transport 
    .sendMail({
        from :"classy2023@gmail.com",
        to:email,
        subject:"Confirmation de votre compte",
        html:`<h2> Bienvenue chez Classy</h2>
        <p>Pour activer votre compte, veuillez cliquer sur ce lien</p>
        <a href=http://localhost:3000/dashboardCentre/${id}/app> Cliquer ici ! </a>`
    })
    .catch((err)=>console.log(err));
}