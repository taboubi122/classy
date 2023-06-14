import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:shop_app/components/custom_surfix_icon.dart';
import 'package:shop_app/components/default_button.dart';
import 'package:shop_app/components/form_error.dart';
import 'package:cool_alert/cool_alert.dart';
import '../../../adresse.dart';
import '../../../constants.dart';
import '../../../size_config.dart';
import 'package:flutter/cupertino.dart';

import '../../home/home_screen.dart';

class SignUpForm extends StatefulWidget {
  @override
  _SignUpFormState createState() => _SignUpFormState();
}

class _SignUpFormState extends State<SignUpForm> {
  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
  final TextEditingController telController = TextEditingController();
  final TextEditingController nomController = TextEditingController();
  final TextEditingController prenomController = TextEditingController();

  final _formKey = GlobalKey<FormState>();
  String? email;
  String? password;
  String? firstName;
  String? lastName;
  String? phoneNumber;
  final List<String?> errors = [];

  void addError({String? error}) {
    if (!errors.contains(error)) {
      setState(() {
        errors.add(error);
      });
    }
  }

  void showSuccessDialog() {
    CoolAlert.show(
      context: context,
      type: CoolAlertType.success,
      title: "Success",
      text: "Please check your email.",
      confirmBtnColor: Colors.black,
      autoCloseDuration: Duration(seconds: 5),
    );
  }

  void removeError({String? error}) {
    if (errors.contains(error)) {
      setState(() {
        errors.remove(error);
      });
    }
  }

  final dio = Dio();

  Future<void> signUp() async {
    if (_formKey.currentState!.validate()) {
      _formKey.currentState!.save();

      try {
        await dio.post('http://${Adresse.adresseIP}:5000/api/SignUp', data: {
          'email': email,
          'password': password,
          'tel': phoneNumber,
          'nom': lastName,
          'prenom': firstName,
        });
        print('Client registration success');
        emailController.clear();
        passwordController.clear();
        telController.clear();
        nomController.clear();
        prenomController.clear();
        showSuccessDialog();
      } catch (err) {
        print(err);
        emailController.clear();
        passwordController.clear();
        telController.clear();
        nomController.clear();
        prenomController.clear();
        print('Client registration failed');
      }
    }
  }

  Future<bool> checkEmail(String email) async {
    final url = 'http://${Adresse.adresseIP}:5000/api/getMail/$email';
    try {
      final response = await Dio().get(url);
      if (response.statusCode == 200) {
        final data = response.data;
        return data.length > 0;
      } else {
        print('Failed to check email: ${response.statusCode}');
        return false;
      }
    } catch (e) {
      print('Error checking email: $e');
      return false;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Form(
      key: _formKey,
      child: Column(
        children: [
          buildEmailFormField(),
          SizedBox(height: getProportionateScreenHeight(30)),
          buildPasswordFormField(),
          SizedBox(height: getProportionateScreenHeight(30)),
          buildFirstNameFormField(),
          SizedBox(height: getProportionateScreenHeight(30)),
          buildLastNameFormField(),
          SizedBox(height: getProportionateScreenHeight(30)),
          buildPhoneNumberFormField(),
          SizedBox(height: getProportionateScreenHeight(30)),
          FormError(errors: errors),
          SizedBox(height: getProportionateScreenHeight(40)),
          DefaultButton(
            text: "Sign Up",
            press: () {
              if (_formKey.currentState!.validate()) {
                _formKey.currentState!.save();
                signUp();
              }
            },
          ),
        ],
      ),
    );
  }

  TextFormField buildPhoneNumberFormField() {
    return TextFormField(
      controller: telController,
      keyboardType: TextInputType.phone,
      onSaved: (newValue) => phoneNumber = newValue,
      onChanged: (value) {
        if (value.isNotEmpty) {
          removeError(error: kPhoneNumberNullError);
        }
        return null;
      },
      validator: (value) {
        if (value!.isEmpty) {
          addError(error: kPhoneNumberNullError);
          return "";
        } else if (value.length != 8) {
          addError(error: "Le numéro de téléphone doit contenir 8 chiffres");
          return "";
        }
        return null;
      },
      decoration: const InputDecoration(
        labelText: "Tel",
        hintText: "Entrer votre Télephone",
        floatingLabelBehavior: FloatingLabelBehavior.always,
        suffixIcon: CustomSurffixIcon(svgIcon: "assets/icons/Phone.svg"),
      ),
    );
  }

  TextFormField buildLastNameFormField() {
    return TextFormField(
      controller: nomController,
      onSaved: (newValue) => lastName = newValue,
      onChanged: (value) {
        if (value.isNotEmpty) {
          removeError(error: kNamelNullError);
        }
        return null;
      },
      validator: (value) {
        if (value!.isEmpty) {
          addError(error: kNamelNullError);
          return "";
        } else if (!isValidName(value)) {
          addError(error: "Le nom ne doit contenir que des lettres");
          return "";
        }
        return null;
      },
      decoration: const InputDecoration(
        labelText: "nom",
        hintText: "Entrer votre nom",
        floatingLabelBehavior: FloatingLabelBehavior.always,
        suffixIcon: CustomSurffixIcon(svgIcon: "assets/icons/User.svg"),
      ),
    );
  }

  bool isValidName(String value) {
    // Regular expression for letters only
    final letterRegExp = RegExp(r'^[a-zA-Z]+$');

    // Check if the name meets the requirements
    if (value.length < 3) {
      return false; // Name length is less than 3
    }
    if (!letterRegExp.hasMatch(value)) {
      return false; // Name contains non-letter characters
    }
    return true; // Name meets all requirements
  }

  TextFormField buildFirstNameFormField() {
    return TextFormField(
      controller: prenomController,
      onSaved: (newValue) => firstName = newValue,
      onChanged: (value) {
        if (value.isNotEmpty) {
          removeError(error: kNamelNullError);
        }
        return null;
      },
      validator: (value) {
        if (value!.isEmpty) {
          addError(error: kNamelNullError);
          return "";
        } else if (!isValidName(value)) {
          addError(error: "Le prénom doit contenir uniquement des lettres.");
          return "";
        }
        return null;
      },
      decoration: const InputDecoration(
        labelText: "Prenom",
        hintText: "Entrer votre Prenom",
        floatingLabelBehavior: FloatingLabelBehavior.always,
        suffixIcon: CustomSurffixIcon(svgIcon: "assets/icons/User.svg"),
      ),
    );
  }

  bool isPasswordValid(String value) {
    // Regular expressions for uppercase letters, lowercase letters, and numbers
    final upperCaseRegExp = RegExp(r'[A-Z]');
    final lowerCaseRegExp = RegExp(r'[a-z]');
    final digitRegExp = RegExp(r'\d');

    // Check if the password meets the requirements
    if (!upperCaseRegExp.hasMatch(value)) {
      return false; // Password does not contain an uppercase letter
    }
    if (!lowerCaseRegExp.hasMatch(value)) {
      return false; // Password does not contain a lowercase letter
    }
    if (!digitRegExp.hasMatch(value)) {
      return false; // Password does not contain a number
    }
    return true; // Password meets all requirements
  }

  TextFormField buildPasswordFormField() {
    return TextFormField(
      controller: passwordController,
      obscureText: true,
      onSaved: (newValue) => password = newValue,
      onChanged: (value) {
        if (value.isNotEmpty) {
          removeError(error: kPassNullError);
        } else if (value.length >= 8) {
          removeError(error: kShortPassError);
        }
        password = value;
      },
      validator: (value) {
        if (value!.isEmpty) {
          addError(error: kPassNullError);
          return "";
        } else if (value.length < 8) {
          addError(error: kShortPassError);
          return "";
        } else if (!isPasswordValid(value)) {
          addError(
              error:
                  "Le mot de passe doit contenir des lettres majuscules, minuscules et des chiffres");
          return "";
        }
        return null;
      },
      decoration: const InputDecoration(
        labelText: "Password",
        hintText: "Entrer votre mot de passe",
        floatingLabelBehavior: FloatingLabelBehavior.always,
        suffixIcon: CustomSurffixIcon(svgIcon: "assets/icons/Lock.svg"),
      ),
    );
  }

  bool isValidMail(String value) {
    if (checkEmail(value) == true) {
      return true;
    }
    return false;
  }

  TextFormField buildEmailFormField() {
    return TextFormField(
      controller: emailController,
      keyboardType: TextInputType.emailAddress,
      onSaved: (newValue) => email = newValue,
      onChanged: (value) {
        if (value.isNotEmpty) {
          removeError(error: kEmailNullError);
        } else if (emailValidatorRegExp.hasMatch(value)) {
          removeError(error: kInvalidEmailError);
        }
        return null;
      },
      validator: (value) {
        if (value!.isEmpty) {
          addError(error: kEmailNullError);
          return "";
        } else if (!emailValidatorRegExp.hasMatch(value)) {
          addError(error: kInvalidEmailError);
        } else if (isValidMail(value)) {
          addError(error: "Mail existant ");
          return "";
        }
        return null;
      },
      decoration: const InputDecoration(
        labelText: "Email",
        hintText: "Entrer votre email",
        floatingLabelBehavior: FloatingLabelBehavior.always,
        suffixIcon: CustomSurffixIcon(svgIcon: "assets/icons/Mail.svg"),
      ),
    );
  }
}
