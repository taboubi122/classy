import 'package:flutter/material.dart';
import 'package:shop_app/components/buttonSplash.dart';
import 'package:shop_app/screens/home/home_screen.dart';
import 'package:shop_app/screens/sign_in/sign_in_screen.dart';

class Body extends StatefulWidget {
  @override
  _BodyState createState() => _BodyState();
}

class _BodyState extends State<Body> {
  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: SizedBox(
        width: double.infinity,
        child: Column(
          children: <Widget>[
            Expanded(
              flex: 3,
              child: Container(
                decoration: const BoxDecoration(
                  image: DecorationImage(
                    image: AssetImage('boarding.png'),
                    fit: BoxFit.cover,
                  ),
                ),
                child: Column(
                  children: [
                    const Spacer(flex: 5),
                    const Text(
                      "CLASSY",
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontFamily: "Robot",
                        fontSize: 26,
                        color: Colors.black,
                      ),
                    ),
                    const SizedBox(),
                    const Padding(
                      padding: EdgeInsets.fromLTRB(
                          70, 16, 70, 28), // Définir les marges souhaitées
                      child: Text(
                        "Bienvenue dans Classy !\nL'application qui révolutionne votre expérience beauté. Découvrez un nouvel univers de réservation en ligne, où vous pouvez facilement planifier vos rendez-vous beauté préférés en quelques clics.",
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontFamily: "Roboto",
                          fontSize: 12,
                          color: Colors.black,
                        ),
                      ),
                    ),
                    buttonSplash(
                      text: "CONNECTER",
                      press: () {
                        Navigator.pushNamed(context, SignInScreen.routeName);
                      },
                      color: Colors.white,
                      bgcolor: Colors.black,
                    ),
                    const SizedBox(height: 7),
                    const SizedBox(),
                    buttonSplash(
                      text: "DÉCOUVREZ",
                      press: () {
                        Navigator.pushNamed(context, HomeScreen.routeName);
                      },
                      color: Color.fromARGB(233, 9, 9, 9),
                      bgcolor: Color.fromARGB(167, 210, 205, 205),
                    ),
                    const Spacer(),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
