import { ChevronDown } from "lucide-react";
import { userAttrs, type Learner } from "@/lib/dashboard";

export function ProfileCard({ user }: { user: Learner }) {
  const attrs = userAttrs(user);
  const firstName =
    typeof attrs.firstName === "string" && attrs.firstName.trim() ? attrs.firstName : user.login;
  return (
    <div className="panel account-panel">
      <div className="account-heading">
        <span className="avatar large">{firstName.slice(0, 1).toUpperCase()}</span>
        <div>
          <p className="panel-kicker">YOUR REBOOT01 PROFILE</p>
          <h2>
            {firstName} {typeof attrs.lastName === "string" ? attrs.lastName : ""}
          </h2>
          <p className="muted">{user.email}</p>
        </div>
        <span className="account-id">ID / {user.id}</span>
      </div>
      <details className="account-details">
        <summary>
          View account details <ChevronDown size={17} />
        </summary>
        <dl>
          <div>
            <dt>Username</dt>
            <dd>{user.login}</dd>
          </div>
          {[
            ["Country", "country"],
            ["City", "addressCity"],
            ["Date of birth", "dateOfBirth"],
            ["Phone", "PhoneNumber"],
            ["Qualification", "qualification"],
            ["Employment", "employment"],
            ["Place of birth", "placeOfBirth"],
            ["Street", "addressStreet"],
            ["Emergency first name", "emergencyFirstName"],
            ["Emergency last name", "emergencyLastName"],
            ["Emergency phone", "emergencyTel"],
          ].map(([label, key]) => (
            <div key={key}>
              <dt>{label}</dt>
              <dd>
                {typeof attrs[key] === "string" && attrs[key] ? String(attrs[key]) : "Not provided"}
              </dd>
            </div>
          ))}
        </dl>
      </details>
    </div>
  );
}
