"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createModal = void 0;
const logos_1 = require("./logos");
const styles_1 = require("./styles");
const createModal = async (props) => {
    var _a;
    // INJECT FORM STYLES
    const style = document.createElement('style');
    style.innerHTML = (0, styles_1.modalStyles)(props.accentColor);
    document.head.appendChild(style);
    // PROVIDERS FOR OAUTH BUTTONS
    const allProviders = [
        { name: 'google', icon: logos_1.googleLogo },
        { name: 'facebook', icon: logos_1.facebookLogo },
        { name: 'apple', icon: logos_1.appleLogo },
        { name: 'github', icon: logos_1.githubLogo },
        { name: 'bitbucket', icon: logos_1.bitbucketLogo },
        { name: 'gitlab', icon: logos_1.gitlabLogo },
        { name: 'linkedin', icon: logos_1.linkedinLogo },
        { name: 'twitter', icon: logos_1.twitterLogo },
        { name: 'discord', icon: logos_1.discordLogo },
        { name: 'twitch', icon: logos_1.twitchLogo },
        { name: 'microsoft', icon: logos_1.microsoftLogo },
    ];
    // make providers included in oauthProviders
    const providers = (_a = props.oauthProviders) === null || _a === void 0 ? void 0 : _a.map((provider) => {
        return allProviders.find((p) => p.name === provider);
    }).filter((p) => p !== undefined);
    const phoneNumberRegex = `(\\+|00)[0-9]{1,3}[0-9]{4,14}(?:x.+)?$`;
    const emailRegex = `^([a-zA-Z0-9_.-])+(\\+[a-zA-Z0-9-]+)?@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})`;
    // MODAL HTML
    const modal = `
    <div class="Magic__formContainer ${props.isDarkMode ? `Magic__dark` : ``}" id="MagicModalBody">
      <button class="Magic__closeButton" id="MagicCloseBtn">&times;</button>
      <div class="Magic__formHeader">
        ${props.customLogo
        ? `<img class="Magic__customLogo" src="${props.customLogo}" />`
        : `<div class="Magic__logo">${logos_1.MagicLogo}</div>`}
        <h1 class='Magic__logoText'> ${props.customHeaderText || 'Magic'} </h1>

        <form class="Magic__formBody" id="MagicForm">
          ${props.enableSMSLogin && props.enableEmailLogin
        ? `
               <label class="Magic__FormLabel">Sign-in with Phone or Email</label>
               <input class="Magic__formInput" id="MagicFormInput" required pattern = "${emailRegex}|${phoneNumberRegex}" placeholder="Phone or Email" />
               `
        : props.enableEmailLogin
            ? `
               <label class="Magic__FormLabel">Sign-in with Email</label>
               <input class="Magic__formInput" id="MagicFormInput" required type="email" placeholder="address@example.com" />
               `
            : props.enableSMSLogin
                ? `
                <label class="Magic__FormLabel">Sign-in with Phone</label>
                <input class="Magic__formInput" id="MagicFormInput" required type="tel" pattern="${phoneNumberRegex}" placeholder="+11234567890" />
              `
                : ``}
          ${props.enableSMSLogin || props.enableEmailLogin
        ? ` <button class="Magic__submitButton" type="submit">
                Send login link
              </button>`
        : ``}
        </form>
        ${providers &&
        providers.length > 0 &&
        (props.enableSMSLogin || props.enableEmailLogin)
        ? `<div class="Magic__divider">
        &#9135;&#9135;&#9135; OR &#9135;&#9135;&#9135;
        </div>`
        : ``}
        <div class="${!props.enableEmailLogin && !props.enableSMSLogin
        ? `Magic__oauthButtonsContainer Magic__aloneOauthContainer`
        : `Magic__oauthButtonsContainer`}">
          ${providers === null || providers === void 0 ? void 0 : providers.map((provider) => {
        return `
                <button class="Magic__oauthButton" id="MagicOauth${provider === null || provider === void 0 ? void 0 : provider.name}" data-provider="${provider === null || provider === void 0 ? void 0 : provider.name}" >
                  <span class="Magic__oauthButtonIcon">${provider === null || provider === void 0 ? void 0 : provider.icon}</span>
                  ${!props.enableSMSLogin && !props.enableEmailLogin
            ? `<span class="Magic__oauthButtonName">${provider === null || provider === void 0 ? void 0 : provider.name}</span>`
            : ``}
                </button>
              `;
    }).join('')}
        </div>
        ${!props.enableEmailLogin &&
        !props.enableEmailLogin &&
        (providers === null || providers === void 0 ? void 0 : providers.length) === 0
        ? `<div>No Login Methods Configured 😥</div>`
        : ``}
      </div>
    </div>
  `;
    // ADD FORM TO BODY
    const overlay = document.createElement('div');
    overlay.classList.add('Magic__formOverlay');
    if (props.isDarkMode)
        overlay.classList.add('Magic__dark');
    document.body.appendChild(overlay);
    overlay.innerHTML = modal;
    const formBody = document.getElementById('MagicModalBody');
    setTimeout(() => {
        if (formBody)
            formBody.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 100);
    // FORM SUBMIT HANDLER
    const removeForm = () => {
        if (formBody)
            formBody.style.transform = 'translate(-50%, -50%) scale(0)';
        setTimeout(() => {
            overlay.remove();
        }, 200);
    };
    return new Promise((resolve) => {
        var _a, _b;
        // FORM CLOSE BUTTON
        (_a = document.getElementById('MagicCloseBtn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
            removeForm();
            resolve({
                email: '',
                phoneNumber: '',
                isGoogle: false,
                isDiscord: false,
            });
        });
        // EMAIL FORM SUBMIT HANDLER
        (_b = document.getElementById('MagicForm')) === null || _b === void 0 ? void 0 : _b.addEventListener('submit', (e) => {
            e.preventDefault();
            const formInputField = document.getElementById('MagicFormInput');
            const isFormValid = formInputField === null || formInputField === void 0 ? void 0 : formInputField.checkValidity();
            if (isFormValid) {
                let output;
                if (RegExp(phoneNumberRegex).test(formInputField.value)) {
                    output = {
                        phoneNumber: formInputField === null || formInputField === void 0 ? void 0 : formInputField.value,
                    };
                }
                else {
                    output = {
                        email: formInputField === null || formInputField === void 0 ? void 0 : formInputField.value,
                    };
                }
                removeForm();
                resolve(output);
            }
        });
        // OAUTH BUTTONS
        providers === null || providers === void 0 ? void 0 : providers.forEach((provider) => {
            const oauthButton = document.getElementById(`MagicOauth${provider === null || provider === void 0 ? void 0 : provider.name}`);
            oauthButton === null || oauthButton === void 0 ? void 0 : oauthButton.addEventListener('click', () => {
                const output = {
                    oauthProvider: provider === null || provider === void 0 ? void 0 : provider.name,
                };
                removeForm();
                resolve(output);
            });
        });
    });
};
exports.createModal = createModal;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlldy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9saWIvbW9kYWwvdmlldy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSxtQ0FhaUI7QUFDakIscUNBQXVDO0FBRWhDLE1BQU0sV0FBVyxHQUFHLEtBQUssRUFBRSxLQVFqQyxFQUFFLEVBQUU7O0lBQ0gscUJBQXFCO0lBQ3JCLE1BQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDOUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxJQUFBLG9CQUFXLEVBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ2pELFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBRWpDLDhCQUE4QjtJQUM5QixNQUFNLFlBQVksR0FBRztRQUNuQixFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLGtCQUFVLEVBQUU7UUFDcEMsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxvQkFBWSxFQUFFO1FBQ3hDLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsaUJBQVMsRUFBRTtRQUNsQyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLGtCQUFVLEVBQUU7UUFDcEMsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRSxxQkFBYSxFQUFFO1FBQzFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsa0JBQVUsRUFBRTtRQUNwQyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLG9CQUFZLEVBQUU7UUFDeEMsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxtQkFBVyxFQUFFO1FBQ3RDLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsbUJBQVcsRUFBRTtRQUN0QyxFQUFFLElBQUksRUFB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