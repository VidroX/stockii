from django.utils.translation import ugettext as _


STATUS_CODE = {
    0: "You have successfully registered.",
    1: "You have successfully registered. You can login now.",
    2: "You have successfully logged in.",
    3: "E-Mail or password is incorrect.",
    4: "Unable to contact auth server. Please try again later.",
    5: "Token has been successfully refreshed.",
    6: "Unable to refresh token.",
    7: "Please provide token.",
    8: "You have successfully logged out.",
    9: "Something went wrong while processing your request.",
    10: "Unable to login.",
    11: "Unable to register.",
    12: "Operation completed successfully.",
    13: "Please provide User ID.",
    14: "User ID or Token is invalid.",
    15: "Access to warehouse has been granted successfully.",
    16: "You don't have enough rights to perform this request.",
    17: "User not found.",
    18: "Access to warehouse has been removed successfully.",
    19: "Unable to remove warehouse access.",
    20: "Method not allowed.",
    21: "Please provider pk.",
    22: "Minimum quantity is less than allowed.",
    23: "Maximum quantity is more than allowed.",
    24: "Minimum quantity is more than product quantity.",
    25: "Maximum quantity is less than product quantity.",
    26: "Incorrect quantity range.",
    27: "Incorrect status."
}
